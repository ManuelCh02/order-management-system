const form = document.querySelector('.main-section__order-place')

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
            newOrder.innerHTML = `<img src="${order.img}" /><span>${order.name}</span><span>$${order.price}</span>`
            newOrder.firstChild.nextSibling.classList.add('font-bold')
            ordersList.append(newOrder)
        }

        form.lastElementChild.append(ordersList)
    } catch(error) {
        console.error('Oops!', error)
    }
} 

showOrders()