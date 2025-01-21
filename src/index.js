const form = document.querySelector('.main-section__order-place')
let formOrdersElements

async function getOrders() {
    const url = 'http://127.0.0.1:3000/orders.json'
    try {
        const response = await fetch(url)
        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const json = await response.json()
        return json
    } catch(error) {
        return console.error(error.message)
    }
}

// Will wait for json and shows response in HTML (orders)
async function showOrders() {
    const orders = await getOrders()

    try {
        const ordersList = document.createElement('ul')
    
        for(let order of orders) {
            const newOrder = document.createElement('li')
            newOrder.innerHTML = `<img src="${order.img}" /><span>${order.name}</span><span id="${order.id}">$${order.price}</span>`
            newOrder.firstChild.nextSibling.classList.add('font-bold')
            ordersList.append(newOrder)
        }

        form.lastElementChild.append(ordersList)

        formOrdersElements = form.lastElementChild.lastElementChild
        formOrdersElements.addEventListener('click', (event) => {
            console.log(event.target)
            const getItemClickedFromEvent = event.target
            if(getItemClickedFromEvent.nodeName !== 'LI') {
                const getEventParentParent = getItemClickedFromEvent.parentNode
                console.log(getEventParentParent)
                if(getEventParentParent.lastElementChild.nodeName !== 'DIV') {
                    createCart(event.target.closest('li')) 
                }
            }
            if(event.target.nodeName === 'LI') {
                const lastItemClicked = event.target.lastElementChild
                if(lastItemClicked.nodeName === 'DIV') {
                    lastItemClicked.classList.remove('hidden')
                    lastItemClicked.classList.add('plus-minus-cart')
                }
                if(lastItemClicked.nodeName !== 'DIV') {
                    createCart(event.target.closest('li')) 
                }     
            }
        })
    } catch(error) {
        console.error('Oops!', error)
    }
} 

showOrders()
// Click event for orders
async function createCart(eventTarget) {
    const orders = await getOrders()
    const plusIcon = "../assets/img/plus.svg"
    const minusIcon = "../assets/img/minus.svg"
    let counter = 1

    const quantityCounter = document.createElement('div')
    quantityCounter.addEventListener('click', (event) => {
        event.stopPropagation()
    })
    quantityCounter.innerHTML = `<img src=${minusIcon} /><span>${counter}</span><img src=${plusIcon} />`
    quantityCounter.classList.add('plus-minus-cart')

    eventTarget.append(quantityCounter)

    quantityCounter.addEventListener('click', (event) => {
        if(event.target.nodeName === 'IMG') {
            cartQuantity(event.target)
        }
    })

    function cartQuantity(icon) {
        const element = quantityCounter.previousElementSibling
        const elementPrice = orders.find(order => order.id === parseInt(element.id)).price

        let totalPrice
        let rounded

        if(icon === quantityCounter.firstChild) {
            counter -= 1
            if(counter !== 0) {
                totalPrice = elementPrice * counter
                rounded = Math.round(totalPrice * 100) / 100
                rounded.toFixed(2)
                element.innerHTML = `$${rounded}`
            }   
        } else if(icon === quantityCounter.lastElementChild) {
            counter += 1
            if(counter !== 0) {
                totalPrice = elementPrice * counter
                rounded = Math.round(totalPrice * 100) / 100
                rounded.toFixed(2)
                element.innerHTML = `$${rounded}`
            }
        }

        if(counter === 0) {
            quantityCounter.classList.add('hidden')
            quantityCounter.classList.remove('plus-minus-cart')
            counter = 1
        } 
        quantityCounter.firstChild.nextSibling.innerHTML = `${counter}`
    } 
}