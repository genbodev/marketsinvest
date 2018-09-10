(function () {
    const WAY_TO_GET_DATA = "src/chart-widget/";
    let chartData = [],
        allStrategyAccounts = {},
        countOfReadyStrategy = 0,
        countAllStrategy = 0,
        chardReadyForWork = false,
        currentStrategy = 0,
        currentLang = document.documentElement.lang,
        translate = {
            'ru': {
                balanceGain: 'Доходность по балансу',
                equityGain: 'Доходнусть по эквити',
                startegyName: 'СТРАТЕГИЯ'
            },
            'en': {
                balanceGain: 'Balance Gain',
                equityGain: 'Equit Gain',
                startegyName: 'STRATEGY'
            }
        };
    moment.locale(currentLang);

    function createAllStrategyOjects() {
        let fileData = new XMLHttpRequest();
        fileData.open("GET", WAY_TO_GET_DATA + "accounts_config.txt", true);
        fileData.onreadystatechange = function () {
            if (fileData.readyState == 4 && fileData.status == "200") {
                for (let i = 0, data = JSON.parse(fileData.responseText), l = data.length; i < l; i++) {
                    allStrategyAccounts[data[i].id] = {
                        signalData: {},
                        perfomanceData: [],
                        periodProfit: {},
                        statisticData: {},
                        dataFromConfig: {
                            id: data[i].id,
                            name: data[i].name,
                            minimalInvestment: data[i].minimalInvestment,
                            managerReward: data[i].managerReward,
                            description_ru: data[i].description_ru,
                            description_en: data[i].description_en,
                            additional_info_ru: data[i].additional_info_ru,
                            additional_info_en: data[i].additional_info_en
                        }
                    };
                }
                for (let i in allStrategyAccounts) {
                    currentStrategy = i;
                    break
                }
                getAllSignalData();
            }
        }
        fileData.send();
    }

    function getAllSignalData() {
        let fileData = new XMLHttpRequest();
        fileData.overrideMimeType("application/json");
        fileData.open("GET", WAY_TO_GET_DATA + "AccountData.json", true);
        fileData.onreadystatechange = function () {
            if (fileData.readyState == 4 && fileData.status == "200") {
                for (let item in allStrategyAccounts) {
                    GFBChart.chartsList.push(allStrategyAccounts[item]);
                    for (let i = 0, data = JSON.parse(fileData.responseText), l = data.length; i < l; i++) {
                        if (data[i].ACCOUNT_ID == item) {
                            allStrategyAccounts[item].signalData = data[i];
                            countAllStrategy++;
                        }
                    }
                }
                getAllPerfomanceData();
            }
        }
        fileData.send();
    }

    function getAllPerfomanceData() {
        for (let item in allStrategyAccounts) {
            getSiglePerfomanceData(item);
        }
    }

    function getSiglePerfomanceData(id) {
        let fileData = new XMLHttpRequest();
        fileData.overrideMimeType("application/json");
        fileData.open("GET", WAY_TO_GET_DATA + id + ".json", true);
        fileData.onreadystatechange = function () {
            if (fileData.readyState == 4 && fileData.status == "200") {
                let chartData = JSON.parse(fileData.responseText),
                    perfomanceData = {
                        equityGainArray: [],
                        balanceGainArray: [],
                        drawdownArray: [],
                        profitLossArray: [],
                        balanceArray: [],
                        profitArray: [],
                        dateArray: [],
                    },
                    periodProfit = {
                        '1W': 'none',
                        '1M': 'none',
                        '2M': 'none',
                        '3M': 'none',
                        '4M': 'none',
                        '5M': 'none',
                        '6M': 'none',
                        '7M': 'none',
                        '8M': 'none',
                        '9M': 'none',
                        '10M': 'none',
                        '11M': 'none',
                        '12M': 'none',
                        'all': chartData[chartData.length - 1].BALANCE_GAIN
                    },
                    gg = [],
                    fixedDates = {
                        '1W': moment().subtract(7, 'd'),
                        '1M': moment().subtract(1, 'M'),
                        '2M': moment().subtract(2, 'M'),
                        '3M': moment().subtract(3, 'M'),
                        '4M': moment().subtract(4, 'M'),
                        '5M': moment().subtract(5, 'M'),
                        '6M': moment().subtract(6, 'M'),
                        '7M': moment().subtract(7, 'M'),
                        '8M': moment().subtract(8, 'M'),
                        '9M': moment().subtract(9, 'M'),
                        '10M': moment().subtract(10, 'M'),
                        '11M': moment().subtract(11, 'M'),
                        '12M': moment().subtract(12, 'M')
                    };
                for (let i = 0, l = chartData.length; i < l; i++) {
                    let variableDay = convertTicksToMoment(chartData[i].DATETIME),
                        variableBalanceGain = chartData[i].BALANCE_GAIN;
                    perfomanceData.equityGainArray.push(chartData[i].EQUITY_GAIN.toFixed(2));
                    perfomanceData.balanceGainArray.push(variableBalanceGain.toFixed(2));
                    perfomanceData.drawdownArray.push(chartData[i].DRAWDOWN.toFixed(2));
                    perfomanceData.profitLossArray.push(chartData[i].POINTS.toFixed(2));
                    perfomanceData.balanceArray.push(chartData[i].BALANCE.toFixed(2));
                    perfomanceData.profitArray.push(chartData[i].PROFIT.toFixed(2));
                    for (let time in fixedDates) {
                        periodProfit[time] = periodProfit[time] === 'none' ? getGainOnCurrentDate(variableDay, fixedDates[time], variableBalanceGain, periodProfit.all) : periodProfit[time];
                    }
                    perfomanceData.dateArray.push(moment(variableDay));
                }
                for (let time in periodProfit) {
                    periodProfit[time] = periodProfit[time] === 'none' ? 0 : periodProfit[time];
                }
                /*window.GFBChart.periodProfit = periodProfit;*/
                allStrategyAccounts[id].periodProfit = periodProfit;
                allStrategyAccounts[id].perfomanceData = perfomanceData;
                countOfReadyStrategy++;
                finishLoadData();
            }
        }
        fileData.send();
    }

    function convertTicksToMoment(date) {
        return moment(new Date((date / 10000 - Math.abs(new Date(0, 0, 1).setFullYear(1)))));
    }

    function getGainOnCurrentDate(variabletDay, partOfDate, variableBalanceGain, allPeriod) {
        return variabletDay >= partOfDate ? allPeriod - variableBalanceGain : 'none';
    }

    function finishLoadData() {
        if(document.getElementById("GFBChart-wrapper")) {
            if (countOfReadyStrategy === countAllStrategy) {
                chardReadyForWork = true;
                clearCanvas();
                renderPageElements()
                fillChart(selectChart('TwoLine', 'Gain'));
                window.GFBChart.finishLoad = true;
            }
        } else return false;
    }

    function fillIndexTable() {
        let currentSignalData = allStrategyAccounts[currentStrategy],
            periodData = currentSignalData.periodProfit;
        document.getElementById('period_all').innerHTML = (+periodData.all.toFixed(2)).toLocaleString() + " %";
        document.getElementById('period_12M').innerHTML = (+periodData['12M'].toFixed(2)).toLocaleString() + " %";
        document.getElementById('period_6M').innerHTML = (+periodData['6M'].toFixed(2)).toLocaleString() + " %";
        document.getElementById('period_3M').innerHTML = (+periodData['3M'].toFixed(2)).toLocaleString() + " %";
        document.getElementById('period_1M').innerHTML = (+periodData['1M'].toFixed(2)).toLocaleString() + " %";
        document.getElementById('period_1W').innerHTML = (+periodData['1W'].toFixed(2)).toLocaleString() + " %";
    }

    function renderPageElements() {
        fillIndexTable();
    }

    function selectChart(dataSetType, typeGraph) {
        let currentPerfomanceData = allStrategyAccounts[currentStrategy].perfomanceData,
            chartOptions = {
                dataSet: [],
                options: {}
            },
            allGraps = {
                'Gain': {
                    dataSet1: currentPerfomanceData.balanceGainArray,
                    dataSet2: currentPerfomanceData.equityGainArray,
                    tooltipUnit: ' %',
                    yAxesLabel: '%'
                },
                'PL': {dataSet1: currentPerfomanceData.profitLossArray, tooltipUnit: '', yAxesLabel: '%'},
                'Balance': {dataSet1: currentPerfomanceData.balanceArray, tooltipUnit: '', yAxesLabel: '%'},
                'Drawdown': {dataSet1: currentPerfomanceData.drawdownArray, tooltipUnit: '%', yAxesLabel: '%'},
                'Profit': {
                    dataSet1: currentPerfomanceData.profitArray,
                    tooltipUnit: " " + allStrategyAccounts[currentStrategy].signalData.CURRENCY,
                    yAxesLabel: " " + allStrategyAccounts[currentStrategy].signalData.CURRENCY
                }
            },
            allDataSets = {
                'TwoLine': {
                    dataSet: [
                        {
                            type: 'line',
                            data: allGraps[typeGraph].dataSet1,
                            borderColor: 'green',
                            lineTension: 0,
                            fill: false,
                            pointHoverBorderWidth: 0,
                            pointRadius: 1,
                            pointHitRadius: 10
                        },
                        {
                            type: 'line',
                            data: allGraps[typeGraph].dataSet2,
                            borderColor: '#ff8000',
                            lineTension: 0,
                            fill: false,
                            pointHoverBorderWidth: 0,
                            pointRadius: 1,
                            pointHitRadius: 10
                        }],
                    options: {
                        yAxesLabel: allGraps[typeGraph].yAxesLabel,
                        yLabel: allGraps[typeGraph].tooltipUnit,
                        tooltipLabel1: translate[currentLang].balanceGain,
                        tooltipLabel2: translate[currentLang].equityGain

                    }
                },
                'SingleLine': {
                    dataSet: [
                        {
                            type: 'line',
                            data: allGraps[typeGraph].dataSet1,
                            borderColor: 'green',
                            lineTension: 0,
                            fill: false,
                            pointHoverBorderWidth: 0,
                            pointRadius: 1,
                            pointHitRadius: 10
                        }],
                    options: {
                        yAxesLabel: allGraps[typeGraph].yAxesLabel,
                        yLabel: allGraps[typeGraph].tooltipUnit,
                        tooltipLabel1: '',
                        tooltipLabel2: ''
                    }
                },
                'SingleBar': {
                    dataSet: [
                        {
                            label: 'bar',
                            data: allGraps[typeGraph].dataSet1,
                            backgroundColor: 'red',
                        }],
                    options: {
                        yAxesLabel: allGraps[typeGraph].yAxesLabel,
                        yLabel: allGraps[typeGraph].tooltipUnit,
                        tooltipLabel1: '',
                        tooltipLabel2: ''
                    }
                }
            };
        return allDataSets[dataSetType]
    }

    function fillChart(chartOptions) {
        window.GFBChart.periodProfit = allStrategyAccounts[currentStrategy].periodProfit;
        window.GFBChart.selectedStrategy = allStrategyAccounts[currentStrategy];

        let canvas = document.getElementById('GFBChart'),
            context = canvas.getContext("2d"),
            chartJS = new Chart(context, {
                type: 'bar',
                data: {
                    labels: allStrategyAccounts[currentStrategy].perfomanceData.dateArray,
                    datasets: chartOptions.dataSet
                },
                options: {
                    animation: false,
                    responsive: true,
                    maintainAspectRatio: false,
                    tooltips: {
                        yPadding: 10,
                        xPadding: 10,
                        caretSize: 8,
                        displayColors: true,
                        fillColor: 'red',
                        backgroundColor: 'rgba(255,255,255,1)',
                        titleFontColor: 'rgba(0,0,0,1)',
                        titleFontStyle: 'normal',
                        titleFontSize: 14,
                        bodyFontColor: 'rgba(0,0,0,1)',
                        bodyFontStyle: 'bold',
                        bodyFontSize: 14,
                        borderColor: 'rgba(0,0,0,1)',
                        borderWidth: 1,
                        callbacks: {
                            title: function (item) {
                                return moment(item[0].xLabel).format("MMM DD, 'YY")
                            },
                            beforeTitle: function (item) {
                                item[0].datasetIndex === 0 ? chartOptions.options.tooltipLabel1 : chartOptions.options.tooltipLabel2
                            },
                            label: function (item) {
                                return item.yLabel.toLocaleString() + chartOptions.options.yLabel;
                            }
                        }
                    },
                    scales: {
                        xAxes: [{
                            barThickness: 1,
                            ticks: {
                                autoSkip: true,
                                maxTicksLimit: 6,
                                maxRotation: 0
                            },
                            type: 'time',
                            time: {
                                displayFormats: {
                                    'milliseconds': "MMM DD, 'YY",
                                    'second': "MMM DD, 'YY",
                                    'minute': "MMM DD, 'YY",
                                    'hour': "MMM DD, 'YY",
                                    'day': "MMM DD, 'YY",
                                    'week': "MMM DD, 'YY",
                                    'month': "MMM DD, 'YY",
                                    'quarter': "MMM DD, 'YY",
                                    'year': "MMM DD, 'YY",
                                }
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                userCallback: function (data) {
                                    return validateYAxes(data, chartOptions.options.yAxesLabel);
                                }
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                },
            });
    }

    function validateNumbers(value) {
        return Number(value.toFixed(2)).toLocaleString();
    }

    function validateYAxes(value, yLabel)
    {
        let sufix = "";
        if (Math.abs(value) > 999999) {
            value = value / 1000000;
            sufix = "M ";
        } else if (Math.abs(value) > 999) {
            value = value / 1000;
            sufix = "K ";
        }
        return validateNumbers(value) + sufix + yLabel;
    }

    function selectChartType(typeLine, typeData) {
        clearCanvas();
        fillChart(selectChart(typeLine, typeData));
    }

    function changeStrategy(id) {
        /*        document.getElementById('strategy_' + currentStrategy).className = "trading";
                document.getElementById('strategy_' + id).className = "trading trading_action";*/
        currentStrategy = id;
        clearCanvas();
        fillIndexTable();
        fillChart(selectChart('TwoLine', 'Gain'));
        /*        document.getElementById('graf_bord1').className = "tab active active-chart";
                document.getElementById('graf_bord2').className = "tab";
                document.getElementById('graf_bord3').className = "tab";*/
    }

    function clearCanvas() {
        document.getElementById("GFBChart-wrapper").innerHTML = '';
        document.getElementById("GFBChart-wrapper").innerHTML = '<canvas id="GFBChart" height="400"></canvas>';
    }

    window.GFBChart = {
        changeStrategy: changeStrategy,
        selectChartType: selectChartType,
        selectedStrategy: "",
        isInitializeDescription: false,
        periodProfit: {},
        finishLoad: false,
        chartsList: []
    };
    createAllStrategyOjects();
}());