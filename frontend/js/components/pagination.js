class LoadMore extends HTMLElement {
    constructor() {
      super();
    }

    connectedCallback() {
      this.dataUrl = this.dataset.loadMore
      this.targetSelector = `${this.dataset.target} ul`
      this.target = document.querySelector(this.targetSelector)
      this.loadMoreWrapper = this.parentElement

  
      this.addEventListener("click", function(e){
        e.preventDefault();
  
        this.closest('nav').classList.add("loading")
  
        fetch(this.dataUrl).then(response => response.text()).then((responseText) => {
          const html = responseText;
          const htmlContent = new DOMParser().parseFromString(html, 'text/html')

            const nextPageContent = htmlContent.querySelector(this.targetSelector)
            this.replaceContent(nextPageContent)

            this.loadMoreWrapper.innerHTML = htmlContent.querySelector(".load-more-wrapper").innerHTML || ""  

            if(document.querySelector("#product-grid #item-count") && htmlContent.querySelector('#item-count')) {
                document.querySelector("#product-grid #item-count").textContent = htmlContent.querySelector('#item-count').textContent
            }

        }).then(() => {
            document.querySelector("#pagination").classList.remove("loading")
        }).catch(() => {
          document.querySelector("#pagination").classList.remove("loading")
        })
      }.bind(this))
    }

    replaceContent(content) {
        this.target.innerHTML = this.target.innerHTML + content.innerHTML;
    }
  }
  
window.customElements.define('load-more', LoadMore)

class PaginationButton extends HTMLElement {
    constructor() {
        super()
        this.dataUrl = this.dataset.url
        this.targetSelector = `${this.dataset.target} ul`
        this.target = document.querySelector(this.targetSelector)
        this.loadMoreWrapper = this.closest('.load-more-wrapper')

    
        this.addEventListener("click", function(e){
            e.preventDefault();
    
            this.closest('nav').classList.add("loading")
    
            fetch(this.dataUrl).then(response => response.text()).then((responseText) => {
                const html = responseText;
                const htmlContent = new DOMParser().parseFromString(html, 'text/html')
                
                const nextPageContent = htmlContent.querySelector(this.targetSelector)
                this.replaceContent(nextPageContent)

                this.loadMoreWrapper.innerHTML = htmlContent.querySelector(".load-more-wrapper").innerHTML || ""  

                if(document.querySelector("#product-grid #item-count") && htmlContent.querySelector('#item-count') ) {
                    document.querySelector("#product-grid #item-count").textContent = htmlContent.querySelector('#item-count').textContent
                }                
            }).then(() => {
              document.querySelector("#pagination").classList.remove("loading")
          }).catch(() => {
            document.querySelector("#pagination").classList.remove("loading")
          })
        }.bind(this))

    }

    replaceContent(content) {
        this.target.innerHTML = content.innerHTML;
        this.target.scrollIntoView()
    }
}

window.customElements.define('pagination-button', PaginationButton)