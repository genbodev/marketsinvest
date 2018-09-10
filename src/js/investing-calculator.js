/**
 * @param - object from chart-widget.js
 * @description - Investing Calculator Logic
 **/

$(function () {
    /**
     * @description - Investing Calculator Model
     **/

    const PAGE_WITH_STRATEGY_DESCRIPTION = "investing-strategies";
    class InvestingModel {
        constructor(size = 2000, periodProfit = 1) {
            this._size = size;
            this._periodProfit = periodProfit;
            this._profit = 0;
            this.usd = 1;
        }

        set size(value) {
            this._size = value;
        }

        get size() {
            return this._size;
        }

        set periodProfit(value) {
            this._periodProfit = window.GFBChart.periodProfit[`${value}M`];
        }

        get periodProfit() {
            return this._periodProfit;
        }

        set profit(value) {
            this._profit = value;
        }

        get profit() {
            return this._profit;
        }

        calculateProfit() {
            this.profit = (this._size + this._size * this._periodProfit / 100) * this.usd;
            drawInvestingProfit(this.profit);
        }
    }

    const investingModel = new InvestingModel();

    /**
     * @type {Promise<any>}
     * @description - Checking is data ready
     */

    let GFBchartData = new Promise((resolve, reject) => {
        const REQUEST_LIMIT = 10;
        const REQUEST_PERIOD = 500;
        let counter = 0;

        if (window.GFBChart.finishLoad) {
            resolve(window.GFBChart);
        } else {
            let intervalId = setInterval(() => {
                counter++;
                if (counter >= REQUEST_LIMIT) {
                    reject();
                    clearInterval(intervalId);
                }
                if (window.GFBChart.finishLoad) {
                    resolve(window.GFBChart);
                    clearInterval(intervalId);
                }
            }, REQUEST_PERIOD);
        }
    });

    /**
     * @param data<object>
     * @description - Fill and draw strategies tabs
     */

    function drawStrategiesTabs(data) {
        const chartTypes = {
            gain: {typeLine: "TwoLine", typeData: "Gain"},
            profit: {typeLine: "SingleLine", typeData: "Profit"},
            drawdown: {typeLine: "SingleBar", typeData: "Drawdown"}
        };
        let tabs = data.chartsList;

        tabs.map((tab, key) => {
            let tabClass = key === 0 ? "app-strategy__nav-tabs__item active" : "app-strategy__nav-tabs__item";
            $("#app-strategies-tabs").append(`
               <li role="presentation" class="${tabClass}">
                    <a href="#strategy" class="app-strategy__nav-tabs__link" aria-controls="strategy"
                        role="tab" data-toggle="tab" data-account-id="${tab.dataFromConfig.id}">${tab.dataFromConfig.name}</a>
               </li>
            `);
            $("#app-strategies-tabs-mobile").append(`
                <li>
                    <a href="#" class="" aria-controls="strategy" data-account-id="${tab.dataFromConfig.id}">${tab.dataFromConfig.name}</a>
               </li>
            `);
        });

        $("#app-strategies-tabs-wrap").mCustomScrollbar({
            theme: "app-scroll-theme"
        });

        $('#app-strategies-tabs a').click(function (e) {
            e.preventDefault();
            window.GFBChart.changeStrategy($(e.target).attr("data-account-id"));
            setActiveTab();
            investingModel.size = +$("#investing-size").attr("data-value");
            investingModel.periodProfit = +$("#investing-term").attr("data-value");
            investingModel.calculateProfit();
            drawStartegyName(window.GFBChart.selectedStrategy.dataFromConfig.name);
            drawStrategyDescription(window.GFBChart.selectedStrategy, window.GFBChart.isInitializeDescription);
            $(this).tab('show');
        });

        $('#app-strategy-tabs a').click(function (e) {
            e.preventDefault();
            let chartType = chartTypes[$(e.target).attr("data-chart-type")];
            window.GFBChart.selectChartType(chartType.typeLine, chartType.typeData);
            $(this).tab('show');
        });

        $("#app-strategy-name-mobile").html(`${window.GFBChart.selectedStrategy.dataFromConfig.name} <span class="app-caret"></span>`);

        $("#app-strategies-tabs-mobile a").click(function (e) {
            e.preventDefault();
            setActiveTab();
            window.GFBChart.changeStrategy($(e.target).attr("data-account-id"));
            drawStrategyDescription(window.GFBChart.selectedStrategy, window.GFBChart.isInitializeDescription);
        });

        $("#app-strategies-tabs-mobile li a").click(function () {
            $("#app-strategy-name-mobile").html(`${$(this).text()} <span class="app-caret"></span>`);
        });
    }

    /**
     * @source - http://seiyria.com/bootstrap-slider/
     * @description - Initialize and draw slides for the investing calculator
     */

    function drawInvestingSliders() {

        $("#investing-size").slider({
            tooltip: 'always',
            value: 2000,
            step: 1000,
            ticks: [1000, 500000],
            ticks_labels: [numeral(1000).format('$ (0,0)'), numeral(500000).format('$ (0,0)')],
            formatter: function (value) {
                investingModel.size = value;
                investingModel.calculateProfit();
                return numeral(value).format('$ (0,0)');
            }
        });

        $("#investing-term").slider({
            tooltip: 'always',
            value: 3,
            step: 1,
            ticks: [1, 6, 12],
            ticks_labels: ['1 мес', '6 мес', '12 мес'],
            formatter: function (value) {
                investingModel.periodProfit = value;
                investingModel.calculateProfit();
                return `${value} мес`;
            }
        });
    }

    function drawStartegyName(value) {
        $("#strategy-name").html(value);
    }

    function drawInvestingProfit(value) {

        $("#investing-profit").html((numeral(value).format('$ (0,0)')));

    }

    function drawStrategyDescription(currentStrategy, isInitialize = false) {
        if (isInitialize) {
            let lang = $("html").attr("lang");
            $("#app-strategies-description-title").html(currentStrategy.dataFromConfig.name);
            $("#app-strategies-description-text").html(currentStrategy.dataFromConfig[`description_${lang}`]);
            $("#app-strategies-description-list").html("");
            currentStrategy.dataFromConfig[`additional_info_${lang}`].map((item, key) => {
                $("#app-strategies-description-list").append(`<li>${item}</li>`);
            });
            $("#app-strategies-description-wrap").show();
        }
    }

    function setActiveTab() {
        let items = $('#app-strategy-tabs li');
        items = [...items];
        items.map((item, key) => {
            if (key === 0) {
                $(item).addClass("active");
            } else {
                $(item).removeClass("active");
            }
        });
    }

    function initInvestingCalculator(data) {

        let currentLocation = window.location.pathname;
        if (currentLocation.indexOf(PAGE_WITH_STRATEGY_DESCRIPTION) === -1) {
            window.GFBChart.isInitializeDescription = false;
        } else {
            window.GFBChart.isInitializeDescription = true;
        }

        drawStrategyDescription(window.GFBChart.selectedStrategy, window.GFBChart.isInitializeDescription);
        drawStartegyName(window.GFBChart.selectedStrategy.dataFromConfig.name);
        drawStrategiesTabs(data);
        drawInvestingSliders();

    }

    GFBchartData.then(initInvestingCalculator, () => {
        console.error(`There is no data in Charts Widget`);
    });

});