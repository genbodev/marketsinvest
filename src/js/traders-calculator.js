$(function () {

    let instrumentsMap = new Map();
    let accountsMap = new Map();
    let ratesMap = new Map();

    const DEFAULT_ACCOUNT = 'standard';
    const LOT_SIZE = 100000;
    const XAU_LOT_SIZE = 100;

    const instruments = [
        { id : 'AUD/CAD', name : 'AUD/CAD', type : 'currency', swapSell : -2.03, swapBuy : -1.82, commission : 0.00004 },
        { id : 'AUD/CHF', name : 'AUD/CHF', type : 'currency', swapSell : -4.34, swapBuy : 0.48, commission : 0.00005 },
        { id : 'AUD/JPY', name : 'AUD/JPY', type : 'currency', swapSell : -4.02, swapBuy : 0.27, commission : 0.00006 },
        { id : 'AUD/NZD', name : 'AUD/NZD', type : 'currency', swapSell : -1.43, swapBuy : -2.9, commission : 0.00007 },
        { id : 'AUD/USD', name : 'AUD/USD', type : 'currency', swapSell : -2, swapBuy : -1.82, commission : 0.00008 },
        { id : 'CAD/CHF', name : 'CAD/CHF', type : 'currency', swapSell : -4.13, swapBuy : 0.27, commission : 0.00009 },
        { id : 'CAD/JPY', name : 'CAD/JPY', type : 'currency', swapSell : -3.41, swapBuy : -0.38, commission : 0.00010 },
        { id : 'CHF/JPY', name : 'CHF/JPY', type : 'currency', swapSell : -1.18, swapBuy : -2.55, commission : 0.00011 },
        { id : 'EUR/AUD', name : 'EUR/AUD', type : 'currency', swapSell : 0.61, swapBuy : -4.26, commission : 0.00012 },
        { id : 'EUR/CAD', name : 'EUR/CAD', type : 'currency', swapSell : -0.03, swapBuy : -3.72, commission : 0.00013 },
        { id : 'EUR/CHF', name : 'EUR/CHF', type : 'currency', swapSell : -2.69, swapBuy : -0.97, commission : 0.00014 },
        { id : 'EUR/GBP', name : 'EUR/GBP', type : 'currency', swapSell : -0.92, swapBuy : -2.79, commission : 0.00015 },
        { id : 'EUR/JPY', name : 'EUR/JPY', type : 'currency', swapSell : -1.69, swapBuy : -1.94, commission : 0.00016 },
        { id : 'EUR/NZD', name : 'EUR/NZD', type : 'currency', swapSell : 0.8, swapBuy : -4.5, commission : 0.00017 },
        { id : 'EUR/USD', name : 'EUR/USD', type : 'currency', swapSell : 0.37, swapBuy : -3.99, commission : 0.00018 },
        { id : 'GBP/AUD', name : 'GBP/AUD', type : 'currency', swapSell : -0.39, swapBuy : -3.35, commission : 0.00019 },
        { id : 'GBP/CAD', name : 'GBP/CAD', type : 'currency', swapSell : -1.04, swapBuy : -2.83, commission : 0.00020 },
        { id : 'GBP/CHF', name : 'GBP/CHF', type : 'currency', swapSell : -3.15, swapBuy : -0.59, commission : 0.00021 },
        { id : 'GBP/JPY', name : 'GBP/JPY', type : 'currency', swapSell : -1.89, swapBuy : -1.96, commission : 0.00022 },
        { id : 'GBP/NZD', name : 'GBP/NZD', type : 'currency', swapSell : -0.19, swapBuy : -3.61, commission : 0.00023 },
        { id : 'GBP/USD', name : 'GBP/USD', type : 'currency', swapSell : -0.52, swapBuy : -3.14, commission : 0.00024 },
        { id : 'NZD/CAD', name : 'NZD/CAD', type : 'currency', swapSell : -2.81, swapBuy : -1.15, commission : 0.00025},
        { id : 'NZD/CHF', name : 'NZD/CHF', type : 'currency', swapSell : -5.26, swapBuy : 0.86, commission : 0.00026 },
        { id : 'NZD/JPY', name : 'NZD/JPY', type : 'currency', swapSell : -4.28, swapBuy : 0.49, commission : 0.00027 },
        { id : 'NZD/USD', name : 'NZD/USD', type : 'currency', swapSell : -2.75, swapBuy : -1.1, commission : 0.00028 },
        { id : 'USD/CAD', name : 'USD/CAD', type : 'currency', swapSell : -2.21, swapBuy : -1.44, commission : 0.00029 },
        { id : 'USD/CHF', name : 'USD/CHF', type : 'currency', swapSell : -4.01, swapBuy : 0.36, commission : 0.00030 },
        { id : 'USD/JPY', name : 'USD/JPY', type : 'currency', swapSell : -3.23, swapBuy : -0.52, commission : 0.00031 },
        { id : 'USD/RUB', name : 'USD/RUB', type : 'currency', swapSell : -0.13, swapBuy : -37.06, commission : 0.00032 },
        { id : 'USD/SGD', name : 'USD/SGD', type : 'currency', swapSell : -3.24, swapBuy : -1.92, commission : 0.00033 },
        { id : 'XAU/USD', name : 'XAU/USD', type : 'metal', swapSell : -1.96, swapBuy : -3.77, commission : 0.00004 }
    ];

    const accounts = [
        {
            id : 'standard',
            name: "Стандартный",
            currency: ["USD", "EUR", "RUB"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        },
        {
            id : 'gold',
            name: "Золотой",
            currency: ["XAU"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        },
        {
            id : 'bitcoin',
            name: "Bitcoin",
            currency: ["BTC"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        }
    ];

    const rates = [
        { id: "AUD/USD", rate : 0.78503 },
        { id: "CAD/USD", rate : 0.79389 },
        { id: "CHF/USD", rate : 1.06546 },
        { id: "EUR/USD", rate : 1.22957 },
        { id: "GBP/USD", rate : 1.38373 },
        { id: "NZD/USD", rate : 0.72515 },
        { id: "XAU/USD", rate : 1323.74 },
        { id: "JPY/USD", rate : 0.00920422 },
        { id: "RUB/USD", rate : 0.0172986 },
        { id: "SGD/USD", rate : 0.755741 },
        { id: "AUD/EUR", rate : 0.63855 },
        { id: "CAD/EUR", rate : 0.64565 },
        { id: "CHF/EUR", rate : 0.86653 },
        { id: "GBP/EUR", rate : 1.12555 },
        { id: "NZD/EUR", rate : 0.58981 },
        { id: "USD/EUR", rate : 0.81343 },
        { id: "XAU/EUR", rate : 1076.94 },
        { id: "JPY/EUR", rate : 0.00748760 },
        { id: "RUB/EUR", rate : 0.0140722 },
        { id: "SGD/EUR", rate : 0.614767 },
        { id: "AUD/RUB", rate : 45.4063 },
        { id: "CAD/RUB", rate : 45.9029 },
        { id: "CHF/RUB", rate : 61.6150 },
        { id: "EUR/RUB", rate : 71.0994 },
        { id: "GBP/RUB", rate : 80.0089 },
        { id: "NZD/RUB", rate : 41.9311 },
        { id: "USD/RUB", rate : 57.8167 },
        { id: "USD/RUB", rate : 76544.40 },
        { id: "JPY/RUB", rate : 0.532076 },
        { id: "SGD/RUB", rate : 43.6813 },
        { id: "AUD/XAU", rate : 0.000593008 },
        { id: "CAD/XAU", rate : 0.000599673 },
        { id: "CHF/XAU", rate : 0.000804846 },
        { id: "EUR/XAU", rate : 0.000928712 },
        { id: "GBP/XAU", rate : 0.00104506 },
        { id: "NZD/XAU", rate : 0.000547747 },
        { id: "USD/XAU", rate : 0.000755561 },
        { id: "JPY/XAU", rate : 0.00000695975 },
        { id: "RUB/XAU", rate : 0.0000130794 },
        { id: "SGD/XAU", rate : 0.000571323 },
        { id: "AUD/BTC", rate : 0.0000890939 },
        { id: "CAD/BTC", rate : 0.0000899434 },
        { id: "CHF/BTC", rate : 0.000120827 },
        { id: "EUR/BTC", rate : 0.000139361 },
        { id: "GBP/BTC", rate : 0.000156835 },
        { id: "NZD/BTC", rate : 0.0000822299 },
        { id: "USD/BTC", rate : 0.000113407 },
        { id: "XAU/BTC", rate : 0.150024 },
        { id: "JPY/BTC", rate : 0.00000103995 },
        { id: "RUB/BTC", rate : 0.00000195446 },
        { id: "SGD/BTC", rate : 0.0000853421 }
    ];

    /**
     * Account model
     */

    class Account {
        constructor(id = "standard", name = "standard", currency = [], leverage = [], commission = 0.0001) {
            this.id = id;
            this.name = name;
            this.currency = currency;
            this.leverage = leverage;
            this.commission = commission;
        }
    }

    /**
     * Instrument model
     */

    class Instrument {
        constructor(id = "EUR/AUD", name = "EUR/AUD", type= "currency", swapSell = 0.00001, swapBuy = 0.00001, commission = 0.00001) {
            this.id = id;
            this.name = name;
            this.type = type;
            this.swapSell = swapSell;
            this.swapBuy = swapBuy;
            this.commission = commission;
        }
    }

    /**
     * Position model
     */

    class Position {
        constructor(size = 0, type = "buy", openPrice = 0, closePrice = 0, leverage = 0, instrument = "EUR/USD", accountCurrency = "EUR/USD",  margin = 0, profit = 0, swapBuy = 0, swapSell = 0, currentSwapAccountCurrency = 0, lotSize = LOT_SIZE) {
            this._size = size;
            this._type = type;
            this._openPrice = openPrice;
            this._closePrice = closePrice;
            this.leverage = leverage;
            this._instrument = instrument;
            this._accountCurrency = accountCurrency;
            this._margin = margin;
            this.profit = profit;
            this.swapBuy = swapBuy;
            this.swapSell = swapSell;
            this._currentSwapAccountCurrency = currentSwapAccountCurrency;
            this._lotSize = lotSize;
        }

        set size(value) {
            this._size = value;
        }

        get size() {
            return this._size;
        }

        set type(value) {
            this._type = value;
        }

        get type() {
            return this._type;
        }

        set openPrice(value) {
            this._openPrice = value;
        }

        get openPrice() {
            return this._openPrice;
        }

        set closePrice(value) {
            this._closePrice = value;
        }

        get closePrice() {
            return this._closePrice;
        }

        set lerevage(value) {
            this._lerevage = value;
        }

        get lerevage() {
            return this._lerevage;
        }

        set margin(value) {
            this._margin = value;
        }

        get instrument() {
            return this._instrument;
        }

        set instrument(value) {
            this._instrument = value;
        }

        get accountCurrency() {
            return this._accountCurrency;
        }

        set accountCurrency(value) {
            this._accountCurrency = value;
        }

        get margin() {
            return this._margin;
        }

        set margin(value) {
            this._margin = value;
        }

        get currentSwapAccountCurrency() {
            return this._currentSwapAccountCurrency;
        }

        set currentSwapAccountCurrency(value) {
            this._currentSwapAccountCurrency = value;
        }


        get lotSize() {
            return this._lotSize;
        }

        set lotSize(value) {
            let lotSize = instrumentsMap.get(value).type === "currency" ? LOT_SIZE : XAU_LOT_SIZE;
            this._lotSize = lotSize;
        }

        calculateMargin() {
            this.lotSize = this.instrument;
            let leverage = +this.leverage.split(":")[1];
            let basicCurrency = this.instrument.split("/")[0];
            if(basicCurrency !== this.accountCurrency) {
                this.margin = this.size * this.lotSize / leverage * ratesMap.get(`${basicCurrency}/${this.accountCurrency}`).rate;
            } else {
                this.margin = this.size * this.lotSize / leverage * 1;
            }
        }
        
        calculateProfit() {

            const ACCURACY = 5;
            this.lotSize = this.instrument;
            let quotedCurrency = this.instrument.split("/")[1];
            let rate = quotedCurrency === this.accountCurrency ? 1 : ratesMap.get(`${quotedCurrency}/${this.accountCurrency}`).rate;
            let trendDirection = (this.openPrice - this.closePrice) > 0 ? "DOWN" : "UP";
            let profit = +(Math.abs(this.closePrice - this.openPrice) * rate * this.size * this.lotSize).toFixed(ACCURACY);
            let commission = +(profit * instrumentsMap.get(this.instrument).commission).toFixed(ACCURACY);
            this.swapBuy = +instrumentsMap.get(this.instrument).swapBuy;
            this.swapSell = +instrumentsMap.get(this.instrument).swapSell;
            let swapBuy = this.swapBuy * rate * this.size.toFixed(ACCURACY);
            let swapSell = this.swapSell * rate * this.size.toFixed(ACCURACY);

            if(this.type === "Buy") {
                this.currentSwap = +instrumentsMap.get(this.instrument).swapBuy * this.size.toFixed(ACCURACY);
                this.currentSwapAccountCurrency = swapBuy;
                if(trendDirection === "UP") {
                    this.profit = profit - commission + swapBuy;
                } else {
                    this.profit = -profit - commission + swapBuy;

                }
            } else {
                this.currentSwap = +instrumentsMap.get(this.instrument).swapSell * this.size.toFixed(ACCURACY);
                this.currentSwapAccountCurrency = swapSell;
                if(trendDirection === "UP") {
                    this.profit = -profit - commission + swapSell;
                } else {
                    this.profit = profit - commission + swapSell;
                }
            }

        }

    }

    instruments.map(function(el, key) {
        instrumentsMap.set(el.id, new Instrument(el.id, el.name, el.type, el.swapSell, el.swapBuy, el.commission));
    });

    accounts.map(function(el, key){
        accountsMap.set(el.id, new Account(el.id, el.name, el.currency, el.leverage));
    });

    rates.map(function(el){
        ratesMap.set(el.id, {id : el.id, rate : el.rate});
    });

    let position = new Position();

    function fillSelect (wrapperId, items, value = null) {
        let wrapperNode = $(`#${wrapperId}`);
        wrapperNode.append("<select class='selectpicker'></select>");
        let selectPicker = $(`#${wrapperId} .selectpicker`);

            items.forEach(function(item) {
                if(value) {
                    selectPicker.append(`<option>${item[value]}</option>`);
                } else {
                    selectPicker.append(`<option>${item}</option>`);
                }
        });
    }

    function fillDataTable(tableCellsWrapId, items) {
        const cellsWrap = $(`#${tableCellsWrapId}`);
        items.map(function(cell){
            cellsWrap.append(`<div class="app-traders-calculator__flex-table__cell">${cell}</div>`);
        });
    }

    function cleanDataTable(tableCellsWrapId) {
        const cellsWrap = $(`#${tableCellsWrapId}`);
        cellsWrap.empty();
    }

    function fillCurrency(currencyWrapClass = "app-currency-wrap", currencyClass = "app-currency", currencyValue = "USD") {
        let currencyNodes = $(`.${currencyWrapClass}`).find(`.${currencyClass}`);
        currencyNodes = [...currencyNodes];
        currencyNodes.map(function(currencyNode){
            $(currencyNode).html(`&nbsp;${currencyValue}`);
        });
    }

    function fillProfitMobile(profitMobileWrapId, profitValue = 10000, dataMobileWrapId) {
        $(`#${profitMobileWrapId}`).html(profitValue);
    }

    function cleanSelect(wrapperId) {
        $(`#${wrapperId}`).empty();
    }

    function rerenderSelect(wrapperId, items, value) {
        cleanSelect(wrapperId);
        fillSelect(wrapperId, items, value)
        $(`#${wrapperId} .selectpicker`).selectpicker('render');
    }

    function handleAccountChange(accountWrapperId, accounts) {
        let currentAccount = null;
        $(`#${accountWrapperId} .selectpicker`).on("changed.bs.select", function() {
            accounts.forEach(function(account) {
                if(account.name === this) {
                   currentAccount = account.id;
                }
            }, $(this).val());
            rerenderSelect("account-currency", accounts.get(currentAccount).currency);
            rerenderSelect("leverage", accounts.get(currentAccount).leverage);
        });
    }

    function handleCalculation(submitBtnId) {
        $(`#${submitBtnId}`).on("click", function(){
            position.leverage = $("#leverage .selectpicker").val();
            position.instrument = $("#order-instrument .selectpicker").val();
            position.accountCurrency = $("#account-currency .selectpicker").val();
            position.size = +$("#order-transaction-volume").val();
            position.openPrice = +$("#order-open-price").val();
            position.closePrice = +$("#order-close-price").val();
            position.type = $("input[name='order-type']:checked").val();

            position.calculateMargin();
            position.calculateProfit();

            let dataTable = [
                position.instrument + " " + position.type,
                numeral(position.openPrice).format('0,0.00000'),
                numeral(position.size).format('0,0.00'),
                numeral(position.currentSwap).format('0,0.0000'),
                numeral(position.currentSwapAccountCurrency).format('0,0.0000'),
                numeral(position.margin).format('0,0.0000'),
                numeral(position.profit).format('0,0.0000')
            ];

            cleanDataTable("traders-calculator-cells-wrap");
            fillDataTable("traders-calculator-cells-wrap", dataTable);
            fillProfitMobile("app-traders-calculator-profit-mobile", numeral(position.profit).format('0,0.0000'));
            fillCurrency("app-currency-wrap", "app-currency", position.accountCurrency);
        });
    }

    function handleCalculationReset(resetBtnId) {
        $(`#${resetBtnId}`).on("click", function(){
            rerenderSelect("account-type", accountsMap, "name");
            handleAccountChange("account-type", accountsMap);
            rerenderSelect("account-currency", accountsMap.get(DEFAULT_ACCOUNT).currency);
            rerenderSelect("leverage", accountsMap.get(DEFAULT_ACCOUNT).leverage);
            rerenderSelect("order-instrument", instrumentsMap, "name");
            cleanDataTable("traders-calculator-cells-wrap");
            fillProfitMobile("app-traders-calculator-profit-mobile", numeral(0).format('0,0.0000'));
            $("#order-transaction-volume").val("0.01");
            $("#order-open-price").val("0.00000");
            $("#order-close-price").val("0.00000");
            fillCurrency("app-currency-wrap", "app-currency", "USD");
        });
    }

    fillSelect("account-type", accountsMap, "name");
    fillSelect("order-instrument", instrumentsMap, "name");
    fillSelect("account-currency", accountsMap.get(DEFAULT_ACCOUNT).currency);
    fillSelect("leverage", accountsMap.get(DEFAULT_ACCOUNT).leverage);
    handleAccountChange("account-type", accountsMap);
    handleCalculation("traders-calculator-submit");
    handleCalculationReset("traders-calculator-reset");


    $("#order-transaction-volume").TouchSpin({
        initval : 0.01,
        min: 0.1,
        max: 1000,
        step: 0.01,
        decimals: 2,
        boostat: 5,
        maxboostedstep: 10
    });
    $("#order-open-price").TouchSpin({
        min: 0,
        max: 100,
        step: 0.00001,
        decimals: 5,
        boostat: 5,
        maxboostedstep: 10
    });
    $("#order-close-price").TouchSpin({
        min: 0,
        max: 100,
        step: 0.00001,
        decimals: 5,
        boostat: 5,
        maxboostedstep: 10
    });
});