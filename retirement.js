let current = document.getElementById("current")
let yearly = document.getElementById("yearly")
let time = document.getElementById("time")
let ROI = document.getElementById("return")
let spending = document.getElementById("spending")
let retirement = document.getElementById("retirement")

let result = document.getElementById("result")

let ctx = document.getElementById('savingsChart').getContext('2d')
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: 'Savings Over Time',
            backgroundColor: 'rgb(16, 201, 66)',
            borderColor: 'rgb(16, 201, 66)',
            data: []
        }]
    },

    // Configuration options go here
    options: {}
})

let button = document.getElementById("calculate")
button.onclick = function () {
    if (current.value === "" || yearly.value  === "" || time.value === "" || ROI.value === "" && spending.value === "" || retirement.value === "") return;

    let c = parseFloat(current.value)
    let y = parseFloat(yearly.value)
    let t = parseInt(time.value)
    let r = 1 + parseFloat(ROI.value) / 100
    let s = parseFloat(spending.value)
    let nr = parseInt(retirement.value)
    
    let saved = Math.round(100 * calculateSavings(c, y, t, r)) / 100
    result.innerText = "Total Savings: $" + (saved).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

    let pts = []
    for (let i = 0; i <= t; i++) {
        pts.push(calculateSavings(c, y, i, r))
    }

    for (let i = 1; i <= nr; i++) {
        pts.push(calculateRetirement(saved, s, i, r))
    }

    document.getElementById('chart').innerHTML = "<canvas id=\"savingsChart\"></canvas>"

    let ctx = document.getElementById('savingsChart').getContext('2d')
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',
    
        // The data for our dataset
        data: {
            labels: [...Array(pts.length).keys()].map(function (value) {
                return value + new Date().getFullYear()
            }),
            datasets: [{
                label: 'Savings Over Time',
                backgroundColor: 'rgb(16, 201, 66)',
                borderColor: 'rgb(16, 201, 66)',
                data: pts
            }]
        },
    
        // Configuration options go here
        options: {
            annotation: {
                annotations: [
                    {
                        drawTime: "afterDatasetsDraw",
                        type: "line",
                        mode: "vertical",
                        scaleID: "x-axis-0",
                        value: t + new Date().getFullYear(),
                        borderWidth: 2,
                        borderColor: "gold",
                        label: {
                            content: "Retirement",
                            enabled: true,
                            position: "top"
                        }
                    }
                ]
            }
        }
    })
}

function calculateSavings(c, y, n, r) {
    let currentProj = c * Math.pow(r, n)
    let futureProj = (y/r)*((Math.pow(r, n) - 1)/(1 - (1/r)))
    return currentProj + futureProj
}

function calculateRetirement(c, y, n, r) {
    for (let i = 0; i < n; i++) {
        c = (c - y)*r
    }

    return c
}