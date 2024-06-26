
var API_URL = 'https://fakestoreapi.com/products'
var productData = []

var product_listing = document.querySelector('#category_listing')
var total_product = document.querySelector('#total_products')
var filter_category = document.querySelector('#filter_category')
var loader = document.querySelector('#loader')
var loadMore = document.querySelector('#loadMore')
var msg = document.querySelector('#msg')

// Errors 
const NETWORK_ERROR = 'There some network error. Please try again'
const NO_DATA_FOUND = 'No Data Found. Please Try Again'

var selectedCategories = []

var searchkeywords = null

var totalProductLoad = 6
var currentPage = 1

// Call API Service
async function _ApiService() {

    loader.style = "display:block"

    try {
        await fetch(API_URL)
            .then((e) => e.json())
            .then((data) => {
                if (data && data.length !== 0) {
                    productData = data
                } else {
                    msg.innerHTML = NO_DATA_FOUND
                }
            })
            .catch((err) => {
                msg.innerHTML = NETWORK_ERROR
            })


        _printListingResponse(productData)
        _setProductCount(productData.length)
        _printFilters(getFilters(productData, 'category'))
    } catch (err) {
        msg.innerHTML = NETWORK_ERROR
    }

    loader.style = "display:none"


}

// Print Product Listing
function _printListingResponse(arr) {
    let html = ''
    arr = arr.slice(0, totalProductLoad * currentPage)
    for (const eachData of arr) {
        const { title, image, price } = eachData
        html += `
                <li>
                    <div class='product_img'>
                        <img src="${image}" />
                    </div>
                    <div class='product_name'>${title}</div>
                    <div class='product_price'>${price}</div>
                </li>
            `
    }
    product_listing.innerHTML = html
}

function _setProductCount(count) {
    if(count == 0) {
        total_product.innerHTML = 'No Product Found'
        return
    }
    total_product.innerHTML = count + ' Results'
}

function getFilters(data, key) {
    return [...new Set(data.map((e) => e[key]))]
}

function _printFilters(arr) {
    let html = ''
    for (const eachData of arr) {
        html += `<li><input value="${eachData}" type="checkbox" onchange="_getSelectedCategory(this)" /><label>${eachData}</label></li>`
    }
    filter_category.innerHTML = html
}

function _sortDataBySelected(data, type, feild, feildType) {
    if (type === 'asc' && feildType == 'number') {
        return data.sort((a, b) => a[feild] - b[feild])
    }
    if (type === 'desc' && feildType == 'number') {
        return data.sort((a, b) => b[feild] - a[feild])
    }
}

function _sortByPrice(e) {
    let selectedValue = e.value
    let sortedData = productData

    if (selectedValue === 'plh') {
        sortedData = _sortDataBySelected(productData, 'asc', 'price', 'number')
    }
    if (selectedValue === 'phl') {
        sortedData = _sortDataBySelected(productData, 'desc', 'price', 'number')
    }
    _printListingResponse(sortedData)
}

function _getSelectedCategory(e) {
    var currentCategory = e.value
    if (e.checked) {
        selectedCategories.push(currentCategory)
    } else {
        selectedCategories = selectedCategories.filter((val) => val !== currentCategory)
    }

    let filteredProducts = _filterByCategory(productData, selectedCategories)
    _printListingResponse(filteredProducts)
    _setProductCount(filteredProducts.length)
}

function _filterByCategory(data, categories) {
    let filteredData = []
    if (categories.length === 0) {
        return data
    }
    filteredData = data.filter((e) => categories.includes(e.category))
    return filteredData
}

function _filterSearchValue(data, keywords) {
    if (!keywords) {
        return data
    }
    return data.filter((e) => {
        return ((e.title).toLowerCase()).search(keywords) >= 0
    })
}

function _handleSearchKeywords(e) {
    let searchValue = ((e.value).toLowerCase()).trim()
    let searchData = _filterSearchValue(productData, searchValue)
    _printListingResponse(searchData)
    _setProductCount(searchData.length)
}


function _loadMore() {
    let totalPages = Math.ceil(productData.length / totalProductLoad)
    if (currentPage <= totalPages) {
        currentPage++
        _printListingResponse(productData)
    }
    if (currentPage == totalPages) loadMore.style = 'display:none'
}


_ApiService()