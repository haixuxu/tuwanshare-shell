export class Loading {
    static show({ text, pointerEvents = 'inherit' }) {
        if (this.html) {
            this.hide()
        }

        this.html = window.$(`
            <div class="double-bounce-loading" style="pointer-events: ${pointerEvents}">
                <div class="double-bounce-block">
                    <div class="bounces">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                    ${text ? `<p>${text}</p>` : ''}
                </div>
            </div>
        `)

        window.$('body').append(this.html)
    }

    static hide() {
        this.html && this.html.remove()
        this.html = null
    }
}