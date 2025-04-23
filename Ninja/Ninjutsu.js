const onItemUse = () => {
    const ninjutsus = actor.items.filter(item => item.name.includes("Ninjutsu:"))
    const ninjutsuCosts = {
        'Ninjutsu: Fuma Shuriken': {
            'any': 1
        },
        'Ninjutsu: Katon': {
            'ten': 1,
            'any': 1
        },
        'Ninjutsu: Raiton': {
            'chi': 1,
            'any': 1
        },
        'Ninjutsu: Shade Shift': {
            "any": 1
        }
    }

    const mudras = ['ten', 'chi', 'jin']
    const actorMudras = actor.items.filter(item => mudras.includes(item.name.toLowerCase()))

    const createStyles = () => {
        const styles = {
            "ninjutsus-container": ["margin: 12px"],
            "ninjutsu-container": [
                "border: 2px solid black",
                "padding: 12px",
                "display: flex",
                "gap: 8px",
                "margin-bottom: 8px",
                "background-color: white",
                "transition: all 0.3s ease-in-out"
            ],
            "ninjutsu-container.selected": [
                `border: 2px solid ${game.user.color.css || 'blue'}`,
                "scale: 1.02",
                `background-color: rgba(${game.user.color.rgb[0] * 255}, ${game.user.color.rgb[1] * 255}, ${game.user.color.rgb[2] * 255}, 0.4)`
            ],
            "ninjutsu-container img": [],
            "ninjutsu-container .ninjutsu-description": [
                "flex: 1;"
            ],
            "cost-container": [
                "display: flex",
                "justify-content: center",
                "gap: 16px",
                "margin-bottom: 12px"
            ],
            "cost-container .cost": [
                "display: flex",
                "flex-direction: column",
                "gap: 8px",
                "border: 1px solid black",
                "text-align: center"
            ],
            "cost-container .cost.fixed": [
                "opacity: 0.7"
            ],
            "cost-container .cost select": [
                "width: 100%"
            ],
        }
        return `<style>${Object.keys(styles).map(key => {
            return `.${key} { ${styles[key].join(";")} }`
        }).join(" ")}</style>`
    }

    const handleError = (message = "") => {
        let errorDialog = new Dialog({
            title: item.name,
            content: `
                <h2>Problema!</h2>
                <div style="margin-bottom: 18px;">
                    <p>${message}</p>
                </div>
            `,
            buttons: {
                confirm: {
                    label: "Fechar",
                    callback: () => { }
                }
            }
        });
        errorDialog.render(true)
    }

    const handleUsingNinjutsu = (html) => {
        const element = html.find(".ninjutsu-container.selected")
        const ninjSelected = element.data("ninjutsu")
        if (!ninjSelected) return handleError("Nenhum Ninjutsu Selecionado")

        const cost = ninjutsuCosts[ninjSelected]
        if (!cost) return handleError("Houve erro com o custo do Ninjutsu")

        const isPossible = Object.keys(cost).every(key => {
            if (key !== 'any') {
                const mudra = actorMudras.find(mudra => mudra.name.toLowerCase() === key.toLowerCase())
                return !!mudra && mudra.system.uses.value >= cost[key]
            }

            const total = actorMudras.reduce((acc, crr) => acc + crr.system.uses.value, 0)
            return total >= Object.keys(cost).length
        })
        if (!isPossible) return handleError("Você não tem Mudras suficiente para usar esse Ninjutsu")

        let fixedMudraContent = ""
        Object.keys(cost).forEach(key => {
            if (key !== 'any') {
                const mudra = actorMudras.find(mudra => mudra.name.toLowerCase() === key.toLowerCase())
                fixedMudraContent += `
                    <div class="cost fixed">
                        <img src="${mudra.img}" width="50px" height="50px" />
                        <p><b>${cost[key]}</b></p>
                    </div>
                `
            }
        })

        let anyMudraContent = ""
        if (cost.any) {
            actorMudras.forEach(mudra => {
                const maxValue = Math.min(mudra.system.uses.value, cost.any)
                anyMudraContent += `
                    <div class="cost">
                        <img src="${mudra.img}" width="50px" height="50px" />
                        <select class="mudra-select" name="${mudra.name.toLowerCase()}" ${!maxValue ? "disabled" : ""}>
                            <option value="0" selected>0</option>
                            ${[...Array(maxValue)].map((_, position) => {
                    return `<option value="${position + 1}">${position + 1}</option>`
                })}
                        </select>
                    </div>
                `
            })
        }

        let yourMudrasContent = ""
        actorMudras.forEach(mudra => {
            yourMudrasContent += `
                <div class="cost fixed">
                    <img src="${mudra.img}" width="50px" height="50px" />
                    <p><b>${mudra.system.uses.value} / ${mudra.system.uses.max}</b></p>
                </div>
            `
        })

        const ninj = ninjutsus.find(ninj => ninj.name === ninjSelected)

        const handleCostConfirm = (html) => {
            const costValues = { ...cost }
            delete costValues.any

            html.find("select.mudra-select").toArray().forEach(select => {
                const mudraName = select.name
                if (costValues[mudraName]) {
                    costValues[mudraName] += +select.value
                } else {
                    costValues[mudraName] = +select.value
                }
            })

            const haveCharges = Object.keys(costValues).every(mudra => {
                const mudraItem = actorMudras.find(item => item.name.toLowerCase() === mudra.toLowerCase())
                return mudraItem.system.uses.value >= costValues[mudra]
            })
            if (!haveCharges) return handleError("Você não tem as cargas selecionadas")

            Object.keys(costValues).forEach(mudra => {
                const mudraItem = actorMudras.find(item => item.name.toLowerCase() === mudra.toLowerCase())
                mudraItem.update({ "system.uses.value": Math.max(0, mudraItem.system.uses.value - costValues[mudra]) })
            })

            ninj.use()
        }

        let costDialog = new Dialog({
            title: ninjSelected,
            content: `
                ${createStyles()}
                <div class="ninjutsu-container" data-ninjutsu="${ninj.name}">
                    <img src="${ninj.img}" width="50px" height="50px" />
                    <div class="ninjutsu-description">
                        <h2>${ninj.name}</h2>
                        ${ninj.system.description.value}
                    </div>
                </div>
                <h2>Your Mudras</h2>
                <div class="cost-container">
                    ${yourMudrasContent}
                </div>
                ${fixedMudraContent ? "<h2>Fixed Mudras</h2>" : ""}
                <div class="cost-container">
                    ${fixedMudraContent}
                </div>
                ${anyMudraContent ? "<h2>Extra Mudras</h2>" : ""}
                <div class="cost-container">
                    ${anyMudraContent}
                </div>
            `,
            buttons: {
                confirm: {
                    label: "Confirmar",
                    callback: handleCostConfirm
                }
            }
        })
        costDialog.render(true, { width: 400 })
    }

    let choiseDialog = new Dialog({
        title: item.name,
        content: `
            ${createStyles()}
            <div class="ninjutsus-container">
                ${ninjutsus.map(ninj => `
                    <div class="ninjutsu-container" data-ninjutsu="${ninj.name}">
                        <img src="${ninj.img}" width="50px" height="50px" />
                        <div class="ninjutsu-description">
                            <h2>${ninj.name}</h2>
                            ${ninj.system.description.value}
                        </div>
                    </div>    
                `).join(" ")}
            </div>
            <script>
                $(".ninjutsu-container").on("click", function () {
                    $(".ninjutsu-container.selected").removeClass("selected")
                    $(this).addClass("selected")
                })
            </script>
            `,
        buttons: {
            confirm: {
                label: "Confirmar",
                callback: handleUsingNinjutsu
            }
        }
    });

    choiseDialog.render(true, { width: 800 })
}
onItemUse()

const nomeDoItemPraRolar = "Dagger"
const item = actor.items.find(item => item.name === nomeDoItemPraRolar)
if (item) {
	item.roll()
}