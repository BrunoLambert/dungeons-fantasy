const onUseItem = () => {
    try {
        const targetedNouliths = game.user.targets.toObject().filter(token => token.name === "Noulith")
        if (!targetedNouliths.length) return

        token.setTarget(false, { releaseOthers: true })

        const createStyles = () => {
            const styles = {
                "#icarus-dialog .targets-selected": [
                    "display: flex",
                    "flex-direction: column",
                    "gap: 50px",
                    "margin-bottom: 12px",
                    "border: 1px solid transparent",
                    "transition: all 0.2s ease",
                    "border-radius: 10px"
                ],
                "#icarus-dialog .targets-selected.error": [
                    "border: 5px solid red",
                    "padding: 12px"
                ],
                "#icarus-dialog .targets-selected > div": [
                    "display: flex",
                    "gap: 12px",
                    "align-items: center"
                ],
                "#icarus-dialog .targets-selected img": [
                    "width: 100px",
                    "height: 100px"
                ],
                "#icarus-dialog .targets-selected h3": [
                    "flex: 1"
                ],
                "#icarus-dialog .targets-selected select": [
                    "width: 100px"
                ]
            }
            return `<style>${Object.keys(styles).map(key => {
                return `${key} { ${styles[key].join(";")} }`
            }).join(" ")}</style>`
        }

        const options = Array.from({ length: targetedNouliths.length + 1 }).map((_, index) => {
            return `<option value=${index}>${index}</option>`
        })

        let choiseDialog = new Dialog({
            title: item.name,
            content: `
                ${createStyles()}
                <div id="icarus-dialog" class="targets-container">
                    <h3>Target the creature you want to deploy the Nouliths</h3>
                    <p>You selected ${targetedNouliths.length} Nouliths to deploy</p>
                    <div class="targets-selected">
                    </div>
                </div>
                <script>
                    window.lastTargets = []
                    window.icarusInterval = setInterval(() => {
                        let targets = game.user.targets.toObject().filter(token => token.name !== "Noulith")
                        let newTargets = targets.filter((target) => !window.lastTargets.includes(target.id))
                        let removed = window.lastTargets.filter(target => !targets.map(t => t.id).includes(target))
                        window.lastTargets = [...lastTargets, ...newTargets.map(target => target.id)].filter(target => !removed.includes(target))

                        let elements = ""
                        newTargets.forEach(target => {
                            elements += "<div id=" + target.id + ">"
                            elements += "<img src=" + target.document.texture.src + " />"
                            elements += "<h3>" + target.document.name + "</h3>"
                            elements += "<select class=" + "deploy-select" + " name=" + target.document.actor.id + ">${options.join(" ")}</select>"
                            elements += "</div>"
                        })
                        $("#icarus-dialog .targets-selected").append(elements)
                        removed.forEach(target => {
                            $("#icarus-dialog .targets-selected #" + target).remove()
                        })
                        let total = 0
                        $(".deploy-select").each(function () {
                            total += +$(this).val()
                        })
                        if (total > ${targetedNouliths.length}) {
                            $("#icarus-dialog .targets-selected").addClass("error")
                        } else {
                            $("#icarus-dialog .targets-selected").removeClass("error")
                        }
                    }, 300)
                </script>
                `,
            buttons: {
                confirm: {
                    label: "Confirmar",
                    callback: () => { }
                }
            },
            close: () => {
                clearInterval(window.icarusInterval)
                window.lastTargets = []
            }
        });

        choiseDialog.render(true, { width: 400, height: 'fit-content', focus: false, top: 50, left: 50 })
    } catch (error) {
        console.log(error)
    }
}