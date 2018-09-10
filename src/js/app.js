let styles = require("../sass/app.scss");

(function () {

    $(window).on("load", function () {

        // Form "request a call" on page contact-us
        let drawContactForms = () => {
            let formsDivs = $('.app-contacts-form');
            if (formsDivs.length > 0) {
                let formDiv, i;
                for (i = 0; i < formsDivs.length; i++) {
                    formDiv = formsDivs[i];
                    $(formDiv).html('<img src="/images/ajaxloader.gif" alt="Loading ..." />');
                }
                $.get(base_url + '/feedback.shtml?ajax=html', {}, function (data) {

                    for (i = 0; i < formsDivs.length; i++) {
                        formDiv = formsDivs[i];
                        $(formDiv).html(data);

                        let nameInput = $(formDiv).find('.name-input');
                        let phoneInput = $(formDiv).find('.phone-input');
                        let emailInput = $(formDiv).find('.email-input');

                        phoneInput.mobilePhoneNumber({allowPhoneWithoutPrefix: '+1'});
                        phoneInput.bind('country.mobilePhoneNumber', function (e, country) {
                            //console.log(country);
                        });

                        $(formDiv).find('.request-form').on('click', function (e) {
                            e.preventDefault();
                            if ($(nameInput).val() !== '' &&
                                $(phoneInput).val() !== '' &&
                                $(phoneInput).mobilePhoneNumber('validate') === true &&
                                $(emailInput).val().search(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i) !== -1
                            ) {
                                let sendData = $(formDiv).serialize();
                                $.post(base_url + '/feedback/send.shtml?ajax=html', sendData, function (result) {
                                    // alert('send!');
                                    let forms = $('.app-contacts-form');
                                    for (let i = 0; i < forms.length; i++) {
                                        $(forms[i]).html(result);
                                    }
                                });

                            } else {
                                alert('wrong!');
                            }

                        });
                    }
                });
            }
        };

        // Form "partner"
        let drawPartnerForms = () => {
            let formsDivs = $('.app-partner-form');
            if (formsDivs.length > 0) {
                let formDiv, i;
                for (i = 0; i < formsDivs.length; i++) {
                    formDiv = formsDivs[i];
                    $(formDiv).html('<img src="/images/ajaxloader.gif" alt="Loading ..." />');
                }
                $.get(base_url + '/request.shtml?ajax=html', {}, function (data) {

                    for (i = 0; i < formsDivs.length; i++) {
                        formDiv = formsDivs[i];
                        $(formDiv).html(data);

                        let nameInput = $(formDiv).find('.app-partner-form__input-name');
                        let phoneInput = $(formDiv).find('.app-partner-form__input-phone');
                        let emailInput = $(formDiv).find('.app-partner-form__input-email');
                        let commentInput = $(formDiv).find('.app-partner-form__input-comment');

                        phoneInput.mobilePhoneNumber({allowPhoneWithoutPrefix: '+1'});
                        phoneInput.bind('country.mobilePhoneNumber', function (e, country) {
                            //console.log(country);
                        });

                        $(formDiv).find('.app-partner-form__button-submit').on('click', function (e) {
                            e.preventDefault();
                            if ($(nameInput).val() !== '' &&
                                $(phoneInput).val() !== '' &&
                                $(phoneInput).mobilePhoneNumber('validate') === true &&
                                $(emailInput).val().search(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i) !== -1
                            ) {
                                let sendData = $(formDiv).serialize();
                                $.post(base_url + '/request/send.shtml?ajax=html', sendData, function (result) {
                                    let forms = $('.app-partner-form');
                                    for (let i = 0; i < forms.length; i++) {
                                        $(forms[i]).html(result);
                                    }
                                });

                            } else {
                                alert('wrong!');
                            }

                        });

                        $(formDiv).find('.app-partner-form__input-comment').click(function(e) {
                            $(commentInput).attr('placeholder', '');
                        });
                    }
                });
            }
        };

        // Consultation form on index page
        let initConsultationForm = function () {

            let form = $('#consultation-form');
            let nameInput = $('#consultation-name');
            let phoneInput = $('#consultation-phone');
            let emailInput = $('#consultation-email');
            //let commentInput = $('#consultation-comment');

            phoneInput.mobilePhoneNumber({allowPhoneWithoutPrefix: '+1'});

            $('#consultation-submit').on('click', function (e) {
                e.preventDefault();
                if ($(nameInput).val() !== '' &&
                    $(phoneInput).val() !== '' &&
                    $(phoneInput).mobilePhoneNumber('validate') === true &&
                    $(emailInput).val().search(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/i) !== -1
                ) {
                    let sendData = $(form).serialize();
                    $.post(base_url + '/consultation/send.shtml?ajax=html', sendData, function (result) {
                        // alert('send!');
                        let bodys = $('#orderConsultationModal').find('.modal-body');
                        for (let i = 0; i < bodys.length; i++) {
                            $(bodys[i]).html(result);
                        }
                    });

                } else {
                    alert('wrong!');
                }

            });
        };

        // Glossary module init
        let initGlossaryModule = function () {

            let glossaryData = new Promise(function (resolve, reject) {
                const REQUEST_LIMIT = 10;
                const REQUEST_PERIOD = 500;
                let counter = 0;

                if (window.glossary) {
                    resolve(window.glossary);
                } else {
                    let intervalId = setInterval(function () {
                        counter++;
                        if (counter >= REQUEST_LIMIT) {
                            reject();
                            clearInterval(intervalId);
                        }
                        if (window.glossary) {
                            resolve(window.glossary);
                            clearInterval(intervalId);
                        }
                    }, REQUEST_PERIOD);
                }
            });

            // Glossary init
            let initGlossary = function () {

                var glossary = [
                    {
                        term: 'Aggregate Demand',
                        description: 'The sum of government spending, personal consumption expenditures, and business expenditures'
                    }, {
                        term: 'Appreciation',
                        description: 'A currency is said to ‘appreciate‘ when it strengthens in price in response to market demand'
                    }, {
                        term: 'Arbitrage',
                        description: 'The purchase or sale of an instrument and simultaneous taking of an equal and opposite position in a related market, in order to take advantage of small price differentials between markets'
                    }, {
                        term: 'Around',
                        description: 'Dealer jargon used in quoting when the forward premium/discount is near parity. For example, “two-two around” would translate into 2 points to either side of the present spot'
                    }, {
                        term: 'Ask Rate',
                        description: 'The rate at which a financial instrument if offered for sale (as in bid/ask spread)'
                    }, {
                        term: 'Asset Allocation',
                        description: 'Investment practice that divides funds among different markets to achieve diversification for risk management purposes and/or expected returns consistent with an investor’s objectives'
                    }, {
                        term: 'Back Office',
                        description: 'The departments and processes related to the settlement of financial transactions'
                    }, {
                        term: 'Balance of Trade',
                        description: 'The value of a country’s exports minus its imports'
                    }, {
                        term: 'Bar Charts',
                        description: 'Standard bar charts are commonly used to convey price activity into an easily readable chart. Usually four elements make up a bar chart, the Open, High, Low, and Close for the trading session/time period. A price bar can represent any time frame the user wishes, from 1 minute to 1 month. The total vertical length/height of the bar represents the entire trading range for the period. The top of the bar represents the highest price of the period, and the bottom of the bar represents the lowest price of the period. The Open is represented by a small dash to the left of the bar, and the Close for the session is a small dash to the right of the bar'
                    }, {
                        term: 'Base Currency',
                        description: 'In general terms, the base currency is the currency in which an investor or issuer maintains its book of accounts. In the FX markets, the US Dollar is normally considered the ‘base’ currency for quotes, meaning that quotes are expressed as a unit of $1 USD per the other currency quoted in the pair. The primary exceptions to this rule are the British Pound, the Euro and the Australian Dollar'
                    }, {
                        term: 'Bear Market',
                        description: 'A market distinguished by declining prices'
                    }, {
                        term: 'Bid Rate',
                        description: 'The rate at which a trader is willing to buy a currency'
                    }, {
                        term: 'Bid/Ask Spread',
                        description: 'The difference between the bid and offer price, and the most widely used measure of market liquidity'
                    }, {
                        term: 'Big Figure',
                        description: 'Dealer expression referring to the first few digits of an exchange rate. These digits rarely change in normal market fluctuations, and therefore are omitted in dealer quotes, especially in times of high market activity. For example, a USD/Yen rate might be 107.30/107.35, but would be quoted verbally without the first three digits i.e. “30/35”'
                    }, {
                        term: 'Book',
                        description: 'In a professional trading environment, a ‘book’ is the summary of a trader’s or desk’s total positions'
                    }, {
                        term: 'Broker',
                        description: 'An individual or firm that acts as an intermediary, putting together buyers and sellers for a fee or commission. In contrast, a ‘dealer’ commits capital and takes one side of a position, hoping to earn a spread (profit) by closing out the position in a subsequent trade with another party'
                    }, {
                        term: 'Bretton Woods Agreement of 1944',
                        description: 'An agreement that established fixed foreign exchange rates for major currencies, provided for central bank intervention in the currency markets, and pegged the price of gold at US $35 per ounce. The agreement lasted until 1971, when President Nixon overturned the Bretton Woods agreement and established a floating exchange rate for the major currencies'
                    }, {
                        term: 'Bull Market',
                        description: 'A market distinguished by rising prices'
                    }, {
                        term: 'Bundesbank',
                        description: 'Germany’s Central Bank'
                    }, {
                        term: 'Buying/Selling',
                        description: 'In the forex market currencies are always priced in pairs; therefore all trades result in the simultaneous buying of one currency and the selling of another. The objective of currency trading is to buy the currency that increases in value relative to the one you sold. If you have bought a currency and the price appreciates in value, then you must sell the currency back in order to lock in the profit'
                    }
                ];

                if (window.glossary) {
                    glossary = JSON.parse(window.glossary);
                }

                const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                let i, j, term, description, letter, terms = {};
                for (i = 0; i < glossary.length; i++) {
                    term = glossary[i]['term'];
                    description = glossary[i]['description'];
                    for (j = 0; j < alphabet.length; j++) {
                        letter = alphabet[j];
                        if (term.charAt(0).toLowerCase() === letter.toLowerCase()) {
                            if (!terms[letter]) {
                                terms[letter] = [];
                            }
                            terms[letter].push(term);
                        }
                    }
                }
                let arr;
                let structuredGlossaryMap = new Map();
                for (letter in terms) {
                    if (terms.hasOwnProperty(letter)) {
                        terms[letter].sort();
                        for (i = 0; i < terms[letter].length; i++) {
                            for (j = 0; j < glossary.length; j++) {
                                term = glossary[j]['term'];
                                description = glossary[j]['description'];
                                if (terms[letter][i] === term) {
                                    arr = structuredGlossaryMap.get(letter);
                                    if (!arr) {
                                        arr = [{term: term, description: description}];
                                        structuredGlossaryMap.set(letter, arr);
                                    } else {
                                        arr.push({term: term, description: description});
                                        structuredGlossaryMap.set(letter, arr);
                                    }
                                }
                            }
                        }
                    }
                }

                let lettersDivs = $('#module-glossary-alphabet').children();
                $(lettersDivs).each(function (index, value) {
                    letter = $(value).text().trim();
                    value.addEventListener('click', {
                        handleEvent: listUpdate,
                        letter: letter
                    }, false);
                    if (index === 0) {
                        value.click();
                    }
                });

                let searchButton = $('#module-glossary-search-button');
                searchButton[0].addEventListener('click', {
                    handleEvent: showSearchResult
                }, false);

                function listUpdate(event) {
                    let letter = this.letter;
                    let letterDiv = $('#module-glossary-letter');
                    $(letterDiv).text(this.letter);
                    let wordsDiv = $('#module-glossary-words');
                    wordsDiv.empty();
                    let terms = structuredGlossaryMap.get(this.letter);
                    let i, wordDiv;
                    if (terms) {
                        for (i = 0; i < terms.length; i++) {
                            wordDiv = $('<div />', {
                                class: 'app-forex-glossary-action__result-word',
                                text: terms[i]['term'].toUpperCase()
                            });
                            $(wordsDiv).append(wordDiv);
                        }
                        let children = $(wordsDiv).children();
                        $(children).each(function (index, value) {
                            value.addEventListener('click', {
                                handleEvent: resultUpdate,
                                term: $(value).text(),
                                letter: letter
                            }, false);
                            if (index === 0) {
                                value.click();
                            }
                        });
                    }

                    letterSelect(this.letter);

                }

                function letterSelect(letter) {
                    let alphabetDiv = $('#module-glossary-alphabet');
                    let lettersDivs = $(alphabetDiv).children();
                    $(lettersDivs).each(function (index, value) {
                        $(value).removeClass('app-forex-glossary-action__alphabet-unit-select');
                        if ($(value).text().trim() === letter) {
                            $(value).addClass('app-forex-glossary-action__alphabet-unit-select');
                        }
                    });
                }

                function resultUpdate(event) {
                    let searchResult = $('#module-glossary-search-result');
                    $(searchResult).hide();
                    let resultDiv = $('#module-glossary-result');
                    let title = $(resultDiv).find('h1');
                    let paragraph = $(resultDiv).find('p');
                    let arr = structuredGlossaryMap.get(this.letter);
                    if (arr) {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i]['term'].toLowerCase() === this.term.toLowerCase()) {
                                $(title).text(arr[i]['term'].charAt(0).toUpperCase() + arr[i]['term'].slice(1));
                                $(paragraph).text(arr[i]['description'].charAt(0).toUpperCase() + arr[i]['description'].slice(1));
                            }
                        }
                    }
                }

                function showSearchResult(event) {

                    const maxCountInResult = 5;

                    let phrase = $('#module-glossary-search-input').val().toLowerCase();
                    let searchStorage = [];
                    let i, terms;
                    for (terms of structuredGlossaryMap.values()) {
                        if (phrase !== '') {
                            for (i = 0; i < terms.length; i++) {
                                if (terms[i]['term'].toLowerCase().indexOf(phrase) !== -1) {
                                    if (searchStorage.length < maxCountInResult) {
                                        searchStorage.push(terms[i]['term']);
                                    }
                                }
                            }
                        }
                    }

                    let drawResult = (terms) => {
                        let resultDiv = $('#module-glossary-search-result');
                        $(resultDiv).empty();
                        let item;
                        for (i = 0; i < terms.length; i++) {
                            item = $('<div />', {
                                class: 'app-forex-glossary-action__result-search__input-wrapper-search-result-item',
                                text: terms[i]
                            });
                            $(resultDiv).append(item);
                        }
                        $(resultDiv).show();
                        let children = resultDiv.children();
                        for (i = 0; i < children.length; i++) {
                            children[i].addEventListener('click', {
                                handleEvent: resultUpdate,
                                term: $(children[i]).text().trim(),
                                letter: $(children[i]).text().trim().charAt(0).toUpperCase()
                            }, false);
                        }
                    };

                    if (searchStorage.length > 0) {
                        $(resultDiv).hide();
                        drawResult(searchStorage);

                    } else if (phrase !== '') {
                        $(resultDiv).hide();
                        let letter = phrase.charAt(0).toUpperCase();
                        let arr = structuredGlossaryMap.get(letter);
                        terms = [];
                        if (arr) {
                            for (i = 0; i < arr.length; i++) {
                                if (terms.length < maxCountInResult) {
                                    terms.push(arr[i]['term']);
                                }
                            }
                            drawResult(terms);
                        }
                    }

                }

                let input = $('#module-glossary-search-input');
                input[0].addEventListener('keyup', {
                    handleEvent: showSearchResultMobile
                }, false);
                input[0].addEventListener('keydown', function (e) {
                    if (e.keyCode === 13) {
                        showSearchResult();
                    }
                }, false);

                function showSearchResultMobile(event) {

                    let i;
                    let resultDivForMobile = $('#module-glossary-result-mobile');
                    $(resultDivForMobile).empty();

                    let phrase = $('#module-glossary-search-input').val().toLowerCase();

                    if (phrase === '') {
                        $('#module-glossary-search-result').hide()
                    }

                    let searchStorage = [];
                    let letter = phrase.charAt(0).toUpperCase();
                    let arr = structuredGlossaryMap.get(letter);
                    if (arr) {
                        for (i = 0; i < arr.length; i++) {
                            if (phrase === arr[i]['term'].substring(0, phrase.length).toLowerCase()) {
                                searchStorage.push(arr[i]);
                            }
                        }
                    }

                    if (searchStorage.length > 0) {
                        let title, paragraph;
                        for (i = 0; i < searchStorage.length; i++) {
                            title = $('<h1 />', {
                                class: 'app-forex-glossary-action__result-search-title',
                                text: searchStorage[i]['term'].charAt(0).toUpperCase() + searchStorage[i]['term'].slice(1)
                            });
                            $(resultDivForMobile).append(title);
                            paragraph = $('<p>', {
                                class: 'app-forex-glossary-action__result-search-paragraph',
                                text: searchStorage[i]['description'].charAt(0).toUpperCase() + searchStorage[i]['description'].slice(1)
                            });
                            $(resultDivForMobile).append(paragraph);
                        }
                    }
                }

                let resultDiv = $('#module-glossary-search-result');
                $(document).click(function (event) {
                    if ($(event.target).closest(resultDiv).length ||
                        $(event.target).closest(input).length ||
                        $(event.target).closest(searchButton).length) {
                        return;
                    }
                    $(resultDiv).hide();
                    event.stopPropagation();
                });


            };

            glossaryData.then(initGlossary, function () {
                console.info('window.glossary is empty!');
                initGlossary();
            });

        };

        /**
         * Load Modules
         */
        const modules = [
            {
                module_name: "advantages",
                module_node: $("#module-advantages"),
                module_on_load_callback: function (data) {
                    this.module_node.html(data);
                },
                module_enabled: false
            },
            {
                module_name: "newswidget",
                module_node: $("#module-news-widget"),
                module_on_load_callback: function module_on_load_callback(data) {
                    this.module_node.html(data);
                },
                module_enabled: false
            },
            {
                module_name: "feedback",
                module_node: $(".app-contacts-form"),
                module_on_load_callback: function (data) {
                    drawContactForms();
                },
                module_enabled: false
            },
            {
                module_name: "consultation",
                module_node: $("#orderConsultationModal"),
                module_on_load_callback: function (data) {
                    this.module_node.html(data);
                    initConsultationForm();
                },
                module_enabled: false
            },
            {
                module_name: "request",
                module_node: $(".app-partner-form"),
                module_on_load_callback: function (data) {
                    drawPartnerForms();
                },
                module_enabled: false
            },
        ];

        if (window.location.pathname.indexOf('glossary') !== -1) {
            initGlossaryModule();
        }

        function include_module(module_obj) {
            if (module_obj.module_node.length > 0) {
                module_obj.module_node.html('<img src="/images/ajaxloader.gif" alt="Loading ..." />');
                $.get(base_url + "/" + module_obj.module_name + ".shtml?ajax=html", {}, function (data) {
                    module_obj.module_on_load_callback(data);
                });
            }
        }

        if (modules.length > 0) {
            modules.map(function (module) {
                if (module.module_enabled === true) {
                    include_module(module);
                }
            });
        }

        /**
         * Set Slider speed
         */

        $("#carousel-index-page").carousel({
            interval: 4000
        });

        /**
         * Correct desktop menu styles
         */

        $("#app-nav-desktop-dropdown").on("mouseover", function () {
            $(".app-nav-desktop-container").addClass("active");
        });
        $("#app-nav-desktop-dropdown .dropdown-menu").on("mouseout", function () {
            $(".app-nav-desktop-container").removeClass("active");
        });

        /**
         * Add scroll bar for the mobile menu
         */

        $("#mobileNavbar .modal-content").mCustomScrollbar({
            theme: "app-scroll-theme"
        });


        // Button "start earning" on some pages. For example: about-us, licensing...
        {
            $("#start-button").click(function () {
                $(location).attr('href', 'https://trade.markets-invest.com/cabinet/signup');
            });
        }

        // introduction-broker calculate
        {
            let resultBlock = $('#profit-per-month');
            if (resultBlock.length) {

                let numberOfClients = 5;
                let averageDeposit = 500;

                let ibCalculate = function () {
                    $(resultBlock).text(numeral(numberOfClients * 60 * averageDeposit).format('$ (0 0)'));
                };

                ibCalculate();

                $('#number-of-clients').slider({
                    tooltip: 'always',
                    value: numberOfClients,
                    step: 1,
                    ticks: [1, 50],
                    ticks_labels: [1, 50],
                    formatter: function (value) {
                        numberOfClients = value;
                        ibCalculate();
                        return value;
                    }
                });

                $('#average-deposit').slider({
                    tooltip: 'always',
                    value: averageDeposit,
                    step: 100,
                    ticks: [200, 2000],
                    ticks_labels: [numeral(200).format('$ (0 0)'), numeral(2000).format('$ (0 0)')],
                    formatter: function (value) {
                        averageDeposit = value;
                        ibCalculate();
                        return numeral(value).format('$ (0 0)');
                    }
                });
            }
        }

        // Click-through events per page FAQ
        {
            let faqUnits = $('.app-frequently-asked-questions-description__unit');
            for (let i = 0; i < faqUnits.length; i++) {
                faqUnits[i].addEventListener('click', function () {
                    let href = $(faqUnits[i]).attr('id') + '.html'
                    if ($(faqUnits[i]).attr('data-lang')) {
                        href = $(faqUnits[i]).attr('data-lang') + '/' + href;
                    }
                    window.location.href = href;
                });
            }
        }

        // Trading Conditions Logic
        {
            let appTradingConditionsTables = $('#app-trading-conditions-tables');
            if (appTradingConditionsTables.length) {

                let prevInnerWidth;
                let actives = ['forex', 'metal', 'stocks', 'commodities', 'index', 'eft', 'crypt'];
                let allData = {
                    "forex": {
                        "ru": {
                            "1": ["Инструмент", "AUD/CAD", "AUD/CHF", "AUD/JPY", "AUD/NZD", "AUD/USD", "CAD/CHF", "CAD/JPY", "CHF/JPY", "EUR/AUD", "EUR/CAD", "EUR/CHF", "EUR/GBP", "EUR/JPY", "EUR/NOK", "EUR/NZD", "EUR/PLN", "EUR/SEK", "EUR/TRY", "EUR/USD", "GBP/AUD", "GBP/CAD", "GBP/CHF", "GBP/JPY", "GBP/NZD", "GBP/SEK", "GBP/USD", "NOK/SEK", "NZD/CAD", "NZD/CHF", "NZD/JPY", "NZD/USD", "USD/CAD", "USD/CHF", "USD/CNH", "USD/JPY", "USD/MXN", "USD/NOK", "USD/PLN", "USD/RUB", "USD/SEK", "USD/SGD", "USD/TRY", "USD/ZAR"],
                            "2": ["Мин. изменение цены", "0,00001", "0,00001", "0,001", "0,00001", "0,00001", "0,00001", "0,001", "0,001", "0,00001", "0,00001", "0,00001", "0,00001", "0,001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,00001", "0,001", "0,00001", "0,00001", "0,00001", "0,00001", "0,001", "0,00001", "0,00001", "0,00001", "0,0001", "0,00001", "0,00001", "0,00001", "0,00001"],
                            "3": ["Стандартный лот", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000", "100000"],
                            "4": ["Мин. объём в лотах", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01"],
                            "5": ["Макс. объём в лотах", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "500", "1000", "500", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "500", "1000", "500", "1000", "500", "500", "1000", "500", "500", "500"],
                            "6": ["Шаг объёма сделки в лотах", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01"],
                            "7": ["Максимальное плечо", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000", "1 : 1000"],
                            "8": ["Открытие", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "21:15", "5:30", "21:15", "21:15", "21:15", "21:15"],
                            "9": ["Закрытие", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "20:45", "14:30", "20:45", "20:45", "20:45", "20:45"]
                        },
                        "en": {}
                    },
                    "metal": {
                        "ru": {
                            "1": ["Название", "Gold"],
                            "2": ["Инструмент", "XAU/USD"],
                            "3": ["Мин. изменение цены", "0.01"],
                            "4": ["Стандартный лот в унциях", "100"],
                            "5": ["Мин. объём в лотах", "0.1"],
                            "6": ["Макс. объём в лотах", "1000"],
                            "7": ["Шаг объёма сделки в лотах", "0.1"],
                            "8": ["Максимальное плечо", "1:500"],
                            "9": ["Открытие", "22:15"],
                            "10": ["Закрытие", "20:45"]
                        },
                        "en": {}
                    },
                    "stocks": {
                        "ru": {
                            "1": ["Инструмент", "ADM", "AV", "BARC", "BATS", "BRBY", "CAN", "GSK", "GLEN", "SBRY", "LGEN", "LLOY", "MGNT", "PRU", "RR", "RBS", "ATAD", "TSCO", "BKIA", "GAS", "MAP", "REP", "TEFBM", "ADS", "BAYN", "BMW", "CON", "DPW", "DTE", "HEN3", "SIE", "VOW3", "MC", "AIR", "SU", "FP", "BN", "OR", "RNO", "UG", "MMM", "AA", "GOOG", "MO", "AMZN", "AXP", "AIG", "AAPL", "T", "BAC", "BA", "CAT", "CVX", "CSCO", "KO", "EBAY", "DD", "XOM", "FDX", "FCX", "GE", "HAL", "HD", "PEP", "HPQ", "INTC", "IBM", "IP", "JNJ", "JPM", "MCD", "MRK", "MSFT", "ORCL", "PFE", "PG", "QCOM", "SBUX", "TSLA", "UPS", "UTX", "VZ", "V", "WMT", "DIS", "WFC", "AABB", "KRA", "GT", "SBER", "RTKM", "VTBR", "PLZL", "CHMF", "ROSN", "GAZP", "GMKN", "URKA", "SIBN", "LKOH", "MTLRP"],
                            "2": ["Название", "Admiral Group", "Aviva PLC", "Barclays PLC", "British American Tobacco", "Burberry Group", "Centrica PLC", "GlaxoSmitdKline PLC", "Glencore PLC", "J Sainsbury PLC", "Legal & General Group PLC", "Lloyds Banking Group PLC", "Magnit", "Prudential PLC", "Rolls-Royce Holdings", "Royal Bank of Scotland Group PLC", "Tatneft", "Tesco PLC", "Bankia", "Gas Natural SDG", "Mapfre", "Repsol", "Telefonica SA", "Adidas", "Bayer", "BMW", "Continental", "Deutsche Post", "Deutsche Telekom", "Henkel & Co KGaA", "Siemens", "Volkswagen", "Moet Henenssy Louis Vuitton", "Airbus Group", "Schneider Electric", "Total", "Danone", "L'Oreal", "Renault", "Peugeot", "3M Company", "Alcoa Corp", "Alphabet Inc C", "Altria Group", "Amazon.com Inc", "American Express Company", "American International Group Inc", "Apple Inc", "AT&T Inc", "Bank of America Corporation", "Boeing Company", "Caterpillar Inc", "Chevron Corporation", "Cisco Systems Inc", "Coca-Cola Company", "eBay Inc", "EI du Pont de Nemours and Company", "Exxon Mobil Corporation", "FedEx Corporation", "Freeport-McMoran Copper & Gold Inc", "General Electric Company", "Halliburton Company", "Home Depot Inc", "PepsiCo Inc", "HP Inc", "Intel Corporation", "International Business Machines", "International Paper Company", "Johnson & Johnson", "JPMorgan Chase & Co", "McDonalds Corporation", "Merck & Company Inc", "Microsoft Corporation", "Oracle Corporation", "Pfizer Inc", "Procter & Gamble Company", "Qualcomm Incorporated", "Starbucks Corporation", "Tesla", "United Parcel Service Inc", "United Technologies Corporation", "Verizon Communications Inc", "Visa Inc", "Wal-Mart Stores Inc", "Walt Disney Company", "Wells Fargo & Company", "Altaba (Yahoo)", "Kraton Performance Polymers", "tde Goodyear Tire & Rubber Company", "Sberbank", "Rostelecom", "VTB Bank", "Polus Zoloto", "Severstal", "Rosneft", "Gazprom", "Norilskiy Nickel", "Uralkaliy", "Gazprom Neft", "Lukoil", "Mechel preferred"],
                            "3": ["Страна", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "United Kingdom", "Spain", "Spain", "Spain", "Spain", "Spain", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "Germany", "France", "France", "France", "France", "France", "France", "France", "France", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "United States of America", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia", "Russia"],
                            "4": ["Валюта котировки", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "GBP", "USD", "GBP", "GBP", "GBP", "USD", "GBP", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "EUR", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "USD", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB", "RUB"],
                            "5": ["Мин. изменение цены", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,0001", "0,01", "0,0001", "0,0001", "0,0001", "0,01", "0,0001", "0,001", "0,005", "0,001", "0,005", "0,001", "0,001", "0,001", "0,001", "0,001", "0,001", "0,001", "0,001", "0,001", "0,001", "0,05", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,005", "0,1", "0,01", "0,01", "0,01", "0,01", "0,01", "0,01", "0,1", "0,01"],
                            "6": ["Мин. Объём", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "10", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
                            "7": ["Макс. Объём", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "1000", "100", "1000", "100"],
                            "8": ["Максимальное плечо", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50", "1:50"],
                            "9": ["Минимальный спред в пунктах", "10", "10", "5", "10", "10", "10", "5", "5", "10", "10", "5", "2", "5", "5", "10", "3", "5", "5", "5", "10", "5", "10", "10", "5", "10", "10", "10", "5", "5", "5", "5", "1", "1", "1", "0,5", "1", "3", "2", "2", "3", "2", "6", "1", "1", "1", "1", "1", "1", "1", "2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "2", "2", "2", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "0", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
                            "10": ["Количество контрактов на 1 лот", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "10", "1", "10"],
                            "11": ["Открытие", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "13:45", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15", "7:15"],
                            "12": ["Закрытие", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "14:15", "15:15", "15:15", "15:15", "14:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "15:15", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "19:45", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15", "14:15"]
                        },
                        "en": {}
                    },
                    "commodities": {
                        "ru": {
                            "1": ["Название", "Brent Crude Oil", "WTI Crude Oil", "Natural Gas"],
                            "2": ["Инструмент", "BRENT", "WTI", "NG"],
                            "3": ["Мин. изменение цены", "0.01", "0.01", "0.001"],
                            "4": ["Мин. Объём", "1", "1", "1"],
                            "5": ["Макс. Объём", "100000", "100000", "100000"],
                            "6": ["Шаг объёма", "1", "1", "1"],
                            "7": ["Максимальное плечо", "1:100", "1:100", "1:100"],
                            "8": ["Количество контрактов на 1 лот", "1", "1", "1"],
                            "9": ["Открытие", "0:15", "0:15", "0:15"],
                            "10": ["Закрытие", "20:45", "20:45", "20:45"]
                        },
                        "en": {}
                    },
                    "index": {
                        "ru": {
                            "1": ["Название", "CAC40", "DAX30", "FTSE100", "Dow Jones", "Nasdaq 100", "S&P 500", "Nikkei 225", "MICEX", "RTS"],
                            "2": ["Инструмент", "CAC40", "DAX30", "FTSE100", "DJI30", "NDX100", "SPX500", "NKY225", "MCX", "RTS"],
                            "3": ["Мин. изменение цены", "0,01", "0,01", "0,01", "0,1", "0,1", "0,1", "0,01", "0,001", "0,001"],
                            "4": ["Мин. Объём", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
                            "5": ["Макс. Объём", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000", "10000"],
                            "6": ["Максимальное плечо", "1:100", "1:100", "1:100", "1:100", "1:100", "1:100", "1:100", "1:100", "1:100"],
                            "7": ["Минимальный спред в пунктах", "10", "10", "15", "10", "10", "5", "50", "0", "0"],
                            "8": ["Количество контрактов на 1 лот", "1", "1", "1", "1", "1", "1", "1", "1", "1"],
                            "9": ["Открытие", "6:15", "6:15", "6:15", "22:45", "22:45", "22:45", "22:15", "7:15", "7:15"],
                            "10": ["Закрытие", "19:45", "19:45", "19:45", "20:45", "20:45", "20:45", "18:45", "14:15", "14:15"]
                        },
                        "en": {}
                    },
                    "eft": {
                        "ru": {
                            "1": ["Название", "iPatd S&P 500", "Samsung"],
                            "2": ["Инструмент", "VXX", "SMSN"],
                            "3": ["Мин. изменение цены", "0,01", "0,5"],
                            "4": ["Мин. Объём", "1", "1"],
                            "5": ["Макс. Объём", "10000", "10000"],
                            "6": ["Максимальное плечо", "1:50", "1:50"],
                            "7": ["Минимальный спред в пунктах", "5", "0,5"],
                            "8": ["Количество контрактов на 1 лот", "1", "1"],
                            "9": ["Открытие", "8:15", "7:15"],
                            "10": ["Закрытие", "20:45", "14:15"]
                        },
                        "en": {}
                    },
                    "crypt": {
                        "ru": {
                            "1": ["Инструмент", "BTC/USD", "XRP/USD", "LTC/USD", "BCH/USD", "ZEC/USD", "XMR/USD", "ETH/USD"],
                            "2": ["Мин. изменение цены", "0.01", "0.00001", "0.01", "0.0001", "0.00001", "0.00001", "0.00001"],
                            "3": ["Стандартный лот", "1", "1", "1", "1", "1", "1", "1"],
                            "4": ["Мин. объём", "1", "1", "1", "1", "1", "1", "1"],
                            "5": ["Макс. объём", "100", "100", "100", "100", "100", "100", "100"],
                            "6": ["Максимальное плечо", "1:2", "1:1", "1:1", "1:2", "1:1", "1:1", "1:1"],
                            "7": ["Открытие", "21:05", "21:05", "21:05", "21:05", "21:05", "21:05", "21:05"]
                        },
                        "en": {}
                    }

                };
                let mobileColumns = {
                    "forex": [1, 3, 4, 7],
                    "metal": [1, 2, 4, 8],
                    "stocks": [1, 2, 8, 9],
                    "commodities": [1, 4, 5, 7],
                    "index": [1, 2, 6, 7],
                    "eft": [1, 2, 6, 7],
                    "crypt": [1, 3, 6],
                };

                // Primary generation
                let currentActive = 'forex';
                generateTable('forex', getActiveData('forex'), 'table-forex-wrapper');

                // Search
                $('#app-trading-conditions-search').keyup(function () {
                    let indexes = [];
                    let str = $(this).val().toLowerCase();
                    let columnData;
                    for (let colNum in allData[currentActive]['ru']) {
                        if (allData[currentActive]['ru'].hasOwnProperty(colNum)) {
                            columnData = allData[currentActive]['ru'][colNum];
                            for (let i = 0; i < columnData.length; i++) {
                                if (i === 0) {
                                    if (indexes.indexOf(i) === -1) {
                                        indexes.push(i);
                                    }
                                    continue;
                                }
                                if (columnData[i].toLowerCase().indexOf(str) !== -1) {
                                    if (indexes.indexOf(i) === -1) {
                                        indexes.push(i);
                                    }
                                }
                            }
                        }
                    }
                    let obj = {};
                    for (let colNum in allData[currentActive]['ru']) {
                        if (allData[currentActive]['ru'].hasOwnProperty(colNum)) {
                            obj[colNum] = [];
                            for (let i = 0; i < allData[currentActive]['ru'][colNum].length; i++) {
                                if (indexes.indexOf(i) !== -1) {
                                    obj[colNum].push(allData[currentActive]['ru'][colNum][i]);
                                }
                            }
                        }
                    }
                    generateTable(currentActive, obj, 'table-' + currentActive + '-wrapper');
                });

                // Select switch
                let selectPicker = $('#trading-conditions-select-list').find('.selectpicker');
                $(selectPicker).on('change', function () {
                    let selected = $(this).val();
                    let active = selected;
                    switch (selected) {
                        case "etf\'s":
                            active = 'eft';
                            break;
                        case "cryptocurrencies":
                            active = 'crypt';
                            break;
                        default:
                            break;
                    }
                    let list = $('li.app-trading-conditions-table__tabs-item a[data-toggle="tab"]');
                    $(list).each(function () {
                        if ($(this).attr('data-active') === active) {
                            $(this).click();
                        }
                    });

                });

                // Tab switch
                $('li.app-trading-conditions-table__tabs-item a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                    let active = $(e.target).attr('data-active');
                    //let relatedActive = $(e.relatedTarget).attr('data-active');
                    generateTable(active, getActiveData(active), 'table-' + active + '-wrapper');
                    $('#app-trading-conditions-search').val('');
                });

                /**
                 * Clear all wrapper of table
                 */
                function clearTableWrapper(relatedActive) {
                    $('#table-' + relatedActive + '-wrapper').empty();
                }

                /**
                 * Return data for table
                 * @param active
                 * @returns {*}
                 */
                function getActiveData(active) {
                    return allData[active]['ru'];
                }

                /**
                 * Generate DOM table
                 * @param active
                 * @param activeData
                 * @param tableWrapperId
                 */
                function generateTable(active, activeData, tableWrapperId) {

                    let data = activeData;
                    for (let value of actives) {
                        clearTableWrapper(value);
                    }
                    currentActive = active;
                    let colNum, i;
                    let innerWidth = window.innerWidth;
                    if (innerWidth <= '767') {
                        data = {};
                        let c = 1;
                        for (colNum in activeData) {
                            if (activeData.hasOwnProperty(colNum)) {
                                for (i = 0; i < mobileColumns[active].length; i++) {
                                    if (mobileColumns[active][i] === parseInt(colNum)) {
                                        data[c] = activeData[colNum];
                                        c = c + 1;
                                    }
                                }
                            }
                        }
                    }

                    let headDataTable = {}, dataTable = {};
                    let colCount = 0;
                    for (colNum in data) {
                        if (data.hasOwnProperty(colNum)) {
                            colCount = colCount + 1;
                            headDataTable[colNum] = [];
                            dataTable[colNum] = [];
                            for (i = 0; i < data[colNum].length; i++) {
                                if (i === 0) {
                                    headDataTable[colNum].push(data[colNum][i]);
                                } else {
                                    dataTable[colNum].push(data[colNum][i]);
                                }
                            }
                        }
                    }

                    let tableWrapper = $('#' + tableWrapperId);

                    // Generate table header
                    let tableHeader = $('<div />', {
                        class: 'app-trading-conditions-table'
                    });
                    let colWidth = Math.floor((100 / colCount) * 100) / 100;
                    let rowCount, order, cellHeaderClass, div, style;
                    let firstColumnFlag = true;
                    for (colNum in headDataTable) {
                        if (headDataTable.hasOwnProperty(colNum)) {
                            rowCount = headDataTable[colNum].length;
                            for (i = 0; i < rowCount; i++) {
                                order = i + 1;
                                cellHeaderClass = '';
                                if (order === 1) {
                                    cellHeaderClass = ' app-trading-conditions-table__cell-header'
                                }
                                style = 'order: ' + order + '; width: ' + colWidth + '%;';
                                // :nth-child(x)
                                if (i === rowCount - 1) {
                                    style = style + ' border-bottom: 0;'
                                }
                                // :nth-child(x)
                                if (parseInt(colNum) === colCount && i === 0) {
                                    style = style + ' border-top-right-radius: 5px; border-right: 0;';
                                }
                                // :nth-child(x)
                                if (i !== 0 && firstColumnFlag === true) {
                                    style = style + ' border-left: solid 1px #d3d3d3;';
                                }
                                // :nth-child(x) {
                                if (i !== 0 && parseInt(colNum) === colCount) {
                                    style = style + ' background-size: 0 0; border-right: solid 1px #d3d3d3;';
                                }
                                div = $('<div />', {
                                    style: style,
                                    class: 'app-trading-conditions-table__cell' + cellHeaderClass,
                                    text: headDataTable[colNum][i]
                                });
                                $(tableHeader).append(div);
                            }
                            firstColumnFlag = false;
                        }
                    }
                    $(tableWrapper).append(tableHeader);

                    // Generate table data
                    let wrp = $('<div />', {
                        css: {maxHeight: '700px', overflow: 'none'}
                    });
                    let tableData = $('<div />', {
                        class: 'app-trading-conditions-table',
                        css: {border: 0, borderBottom: 'solid 1px #d3d3d3'},
                    });
                    firstColumnFlag = true;
                    let tableBottomLeftCell = true;
                    for (colNum in dataTable) {
                        if (dataTable.hasOwnProperty(colNum)) {
                            rowCount = dataTable[colNum].length;
                            for (i = 0; i < rowCount; i++) {
                                order = i + 1;
                                style = 'order: ' + order + '; width: ' + colWidth + '%;';
                                // :nth-child(x)
                                if (i === rowCount - 1) {
                                    style = style + ' border-bottom: 0;'
                                }
                                // :nth-child(x)
                                if (i === rowCount - 1 && tableBottomLeftCell === true) {
                                    style = style + ' border-bottom-left-radius: 5px;';
                                    tableBottomLeftCell = false;
                                }
                                // :last-child
                                if (parseInt(colNum) === colCount && i === rowCount - 1) {
                                    style = style + ' border-bottom-right-radius: 5px;';
                                }
                                // :nth-child(x)
                                if (firstColumnFlag === true) {
                                    style = style + ' border-left: solid 1px #d3d3d3;';
                                }
                                // :nth-child(x) {
                                if (parseInt(colNum) === colCount) {
                                    style = style + ' background-size: 0 0; border-right: solid 1px #d3d3d3;';
                                }
                                div = $('<div />', {
                                    style: style,
                                    class: 'app-trading-conditions-table__cell',
                                    text: dataTable[colNum][i]
                                });
                                $(tableData).append(div);
                            }
                            firstColumnFlag = false;
                        }
                    }

                    $(wrp).append(tableData);
                    $(tableWrapper).append(wrp);

                    // add scroll bar
                    $(wrp).mCustomScrollbar({
                        theme: "app-scroll-theme"
                    });

                }

                // Resize
                $(window).resize(function () {
                    (deBounce(function () {
                        generateTable(currentActive, getActiveData(currentActive), 'table-' + currentActive + '-wrapper');
                        if (window.innerWidth !== prevInnerWidth) {
                            $('#app-trading-conditions-search').val('');
                            prevInnerWidth = innerWidth;
                        }
                    }, 100))();
                });

                /**
                 * Function that prohibits exaggerating the performance of another function in order to improve performance
                 * @param func - Function, which should be prohibited from exaggeration
                 * @param wait - How long to wait in ms before the function can be executed again
                 * @param immediate - true, if you need to execute immediately
                 * @returns {Function}
                 */
                function deBounce(func, wait, immediate) {
                    let timeout;
                    return function () {
                        let context = this, args = arguments;
                        let later = function () {
                            timeout = null;
                            if (!immediate) func.apply(context, args);
                        };
                        let callNow = immediate && !timeout;
                        clearTimeout(timeout);
                        timeout = setTimeout(later, wait);
                        if (callNow) func.apply(context, args);
                    };
                }

            }


        }

    });

    let resizeTimer;

    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            if ($(window).width() >= 1200) // Breakpoin plugin is activated (1200px)
                $("#mobileNavbar").modal("hide");
        }, 200)
    });

    // Add slideup & fadein animation to dropdown
    $('.dropdown').on('show.bs.dropdown', function (e) {
        var $dropdown = $(this).find('.dropdown-menu');
        var orig_margin_top = parseInt($dropdown.css('margin-top'));
        $dropdown.css({
            'margin-top': (orig_margin_top - 10) + 'px',
            opacity: 0
        }).animate({'margin-top': orig_margin_top + 'px', opacity: 1}, 300, function () {
            $(this).css({'margin-top': ''});
        });
    });
    // Add slidedown & fadeout animation to dropdown
    $('.dropdown').on('hide.bs.dropdown', function (e) {
        var $dropdown = $(this).find('.dropdown-menu');
        var orig_margin_top = parseInt($dropdown.css('margin-top'));
        $dropdown.css({
            'margin-top': orig_margin_top + 'px',
            opacity: 1,
            display: 'block'
        }).animate({'margin-top': (orig_margin_top - 20) + 'px', opacity: 0}, 300, function () {
            $(this).css({'margin-top': '', display: ''});
        });
    });

    /**
     * Initializing for the mobile language switcher
     */

    const langImages = {
        "Русский": "russia",
        "English": "united-kingdom",
        "العربية": "united-arab-emirates",
        "Français": "france"
    };

    const langImageType = "svg";

    const langImageFolder = "images/";

    $("#app-lang-flag").find("img").attr("src", `${langImageFolder}/${langImages[$("#app-mobile-lang-switcher").find(".selectpicker").val()]}.${langImageType}`);

    $("#app-mobile-lang-switcher").on("click", function (e) {
        $("#app-lang-flag").find("img").attr("src", `${langImageFolder}/${langImages[$(this).find(".selectpicker").val()]}.${langImageType}`);
    });

    let instrumentsMap = new Map();
    let accountsMap = new Map();
    let ratesMap = new Map();

    const DEFAULT_ACCOUNT = 'standard';
    const LOT_SIZE = 100000;
    const XAU_LOT_SIZE = 100;

    const instruments = [
        {id: 'AUD/CAD', name: 'AUD/CAD', type: 'currency', swapSell: -2.03, swapBuy: -1.82, commission: 0.00004},
        {id: 'AUD/CHF', name: 'AUD/CHF', type: 'currency', swapSell: -4.34, swapBuy: 0.48, commission: 0.00005},
        {id: 'AUD/JPY', name: 'AUD/JPY', type: 'currency', swapSell: -4.02, swapBuy: 0.27, commission: 0.00006},
        {id: 'AUD/NZD', name: 'AUD/NZD', type: 'currency', swapSell: -1.43, swapBuy: -2.9, commission: 0.00007},
        {id: 'AUD/USD', name: 'AUD/USD', type: 'currency', swapSell: -2, swapBuy: -1.82, commission: 0.00008},
        {id: 'CAD/CHF', name: 'CAD/CHF', type: 'currency', swapSell: -4.13, swapBuy: 0.27, commission: 0.00009},
        {id: 'CAD/JPY', name: 'CAD/JPY', type: 'currency', swapSell: -3.41, swapBuy: -0.38, commission: 0.00010},
        {id: 'CHF/JPY', name: 'CHF/JPY', type: 'currency', swapSell: -1.18, swapBuy: -2.55, commission: 0.00011},
        {id: 'EUR/AUD', name: 'EUR/AUD', type: 'currency', swapSell: 0.61, swapBuy: -4.26, commission: 0.00012},
        {id: 'EUR/CAD', name: 'EUR/CAD', type: 'currency', swapSell: -0.03, swapBuy: -3.72, commission: 0.00013},
        {id: 'EUR/CHF', name: 'EUR/CHF', type: 'currency', swapSell: -2.69, swapBuy: -0.97, commission: 0.00014},
        {id: 'EUR/GBP', name: 'EUR/GBP', type: 'currency', swapSell: -0.92, swapBuy: -2.79, commission: 0.00015},
        {id: 'EUR/JPY', name: 'EUR/JPY', type: 'currency', swapSell: -1.69, swapBuy: -1.94, commission: 0.00016},
        {id: 'EUR/NZD', name: 'EUR/NZD', type: 'currency', swapSell: 0.8, swapBuy: -4.5, commission: 0.00017},
        {id: 'EUR/USD', name: 'EUR/USD', type: 'currency', swapSell: 0.37, swapBuy: -3.99, commission: 0.00018},
        {id: 'GBP/AUD', name: 'GBP/AUD', type: 'currency', swapSell: -0.39, swapBuy: -3.35, commission: 0.00019},
        {id: 'GBP/CAD', name: 'GBP/CAD', type: 'currency', swapSell: -1.04, swapBuy: -2.83, commission: 0.00020},
        {id: 'GBP/CHF', name: 'GBP/CHF', type: 'currency', swapSell: -3.15, swapBuy: -0.59, commission: 0.00021},
        {id: 'GBP/JPY', name: 'GBP/JPY', type: 'currency', swapSell: -1.89, swapBuy: -1.96, commission: 0.00022},
        {id: 'GBP/NZD', name: 'GBP/NZD', type: 'currency', swapSell: -0.19, swapBuy: -3.61, commission: 0.00023},
        {id: 'GBP/USD', name: 'GBP/USD', type: 'currency', swapSell: -0.52, swapBuy: -3.14, commission: 0.00024},
        {id: 'NZD/CAD', name: 'NZD/CAD', type: 'currency', swapSell: -2.81, swapBuy: -1.15, commission: 0.00025},
        {id: 'NZD/CHF', name: 'NZD/CHF', type: 'currency', swapSell: -5.26, swapBuy: 0.86, commission: 0.00026},
        {id: 'NZD/JPY', name: 'NZD/JPY', type: 'currency', swapSell: -4.28, swapBuy: 0.49, commission: 0.00027},
        {id: 'NZD/USD', name: 'NZD/USD', type: 'currency', swapSell: -2.75, swapBuy: -1.1, commission: 0.00028},
        {id: 'USD/CAD', name: 'USD/CAD', type: 'currency', swapSell: -2.21, swapBuy: -1.44, commission: 0.00029},
        {id: 'USD/CHF', name: 'USD/CHF', type: 'currency', swapSell: -4.01, swapBuy: 0.36, commission: 0.00030},
        {id: 'USD/JPY', name: 'USD/JPY', type: 'currency', swapSell: -3.23, swapBuy: -0.52, commission: 0.00031},
        {id: 'USD/RUB', name: 'USD/RUB', type: 'currency', swapSell: -0.13, swapBuy: -37.06, commission: 0.00032},
        {id: 'USD/SGD', name: 'USD/SGD', type: 'currency', swapSell: -3.24, swapBuy: -1.92, commission: 0.00033},
        {id: 'XAU/USD', name: 'XAU/USD', type: 'metal', swapSell: -1.96, swapBuy: -3.77, commission: 0.00004}
    ];

    const accounts = [
        {
            id: 'standard',
            name: "Стандартный",
            currency: ["USD", "EUR", "RUB"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        },
        {
            id: 'gold',
            name: "Золотой",
            currency: ["XAU"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        },
        {
            id: 'bitcoin',
            name: "Bitcoin",
            currency: ["BTC"],
            leverage: ["1:1", "1:10", "1:20", "1:50", "1:100", "1:200", "1:500", "1:1000"]
        }
    ];

    const rates = [
        {id: "AUD/USD", rate: 0.78503},
        {id: "CAD/USD", rate: 0.79389},
        {id: "CHF/USD", rate: 1.06546},
        {id: "EUR/USD", rate: 1.22957},
        {id: "GBP/USD", rate: 1.38373},
        {id: "NZD/USD", rate: 0.72515},
        {id: "XAU/USD", rate: 1323.74},
        {id: "JPY/USD", rate: 0.00920422},
        {id: "RUB/USD", rate: 0.0172986},
        {id: "SGD/USD", rate: 0.755741},
        {id: "AUD/EUR", rate: 0.63855},
        {id: "CAD/EUR", rate: 0.64565},
        {id: "CHF/EUR", rate: 0.86653},
        {id: "GBP/EUR", rate: 1.12555},
        {id: "NZD/EUR", rate: 0.58981},
        {id: "USD/EUR", rate: 0.81343},
        {id: "XAU/EUR", rate: 1076.94},
        {id: "JPY/EUR", rate: 0.00748760},
        {id: "RUB/EUR", rate: 0.0140722},
        {id: "SGD/EUR", rate: 0.614767},
        {id: "AUD/RUB", rate: 45.4063},
        {id: "CAD/RUB", rate: 45.9029},
        {id: "CHF/RUB", rate: 61.6150},
        {id: "EUR/RUB", rate: 71.0994},
        {id: "GBP/RUB", rate: 80.0089},
        {id: "NZD/RUB", rate: 41.9311},
        {id: "USD/RUB", rate: 57.8167},
        {id: "USD/RUB", rate: 76544.40},
        {id: "JPY/RUB", rate: 0.532076},
        {id: "SGD/RUB", rate: 43.6813},
        {id: "AUD/XAU", rate: 0.000593008},
        {id: "CAD/XAU", rate: 0.000599673},
        {id: "CHF/XAU", rate: 0.000804846},
        {id: "EUR/XAU", rate: 0.000928712},
        {id: "GBP/XAU", rate: 0.00104506},
        {id: "NZD/XAU", rate: 0.000547747},
        {id: "USD/XAU", rate: 0.000755561},
        {id: "JPY/XAU", rate: 0.00000695975},
        {id: "RUB/XAU", rate: 0.0000130794},
        {id: "SGD/XAU", rate: 0.000571323},
        {id: "AUD/BTC", rate: 0.0000890939},
        {id: "CAD/BTC", rate: 0.0000899434},
        {id: "CHF/BTC", rate: 0.000120827},
        {id: "EUR/BTC", rate: 0.000139361},
        {id: "GBP/BTC", rate: 0.000156835},
        {id: "NZD/BTC", rate: 0.0000822299},
        {id: "USD/BTC", rate: 0.000113407},
        {id: "XAU/BTC", rate: 0.150024},
        {id: "JPY/BTC", rate: 0.00000103995},
        {id: "RUB/BTC", rate: 0.00000195446},
        {id: "SGD/BTC", rate: 0.0000853421}
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
        constructor(id = "EUR/AUD", name = "EUR/AUD", type = "currency", swapSell = 0.00001, swapBuy = 0.00001, commission = 0.00001) {
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
        constructor(size = 0, type = "buy", openPrice = 0, closePrice = 0, leverage = 0, instrument = "EUR/USD", accountCurrency = "EUR/USD", margin = 0, profit = 0, swapBuy = 0, swapSell = 0, currentSwapAccountCurrency = 0, lotSize = LOT_SIZE) {
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
            if (basicCurrency !== this.accountCurrency) {
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

            if (this.type === "Buy") {
                this.currentSwap = +instrumentsMap.get(this.instrument).swapBuy * this.size.toFixed(ACCURACY);
                this.currentSwapAccountCurrency = swapBuy;
                if (trendDirection === "UP") {
                    this.profit = profit - commission + swapBuy;
                } else {
                    this.profit = -profit - commission + swapBuy;

                }
            } else {
                this.currentSwap = +instrumentsMap.get(this.instrument).swapSell * this.size.toFixed(ACCURACY);
                this.currentSwapAccountCurrency = swapSell;
                if (trendDirection === "UP") {
                    this.profit = -profit - commission + swapSell;
                } else {
                    this.profit = profit - commission + swapSell;
                }
            }

        }

    }

    instruments.map(function (el, key) {
        instrumentsMap.set(el.id, new Instrument(el.id, el.name, el.type, el.swapSell, el.swapBuy, el.commission));
    });

    accounts.map(function (el, key) {
        accountsMap.set(el.id, new Account(el.id, el.name, el.currency, el.leverage));
    });

    rates.map(function (el) {
        ratesMap.set(el.id, {id: el.id, rate: el.rate});
    });

    let position = new Position();

    function fillSelect(wrapperId, items, value = null) {
        let wrapperNode = $(`#${wrapperId}`);
        wrapperNode.append("<select class='selectpicker'></select>");
        let selectPicker = $(`#${wrapperId} .selectpicker`);

        items.forEach(function (item) {
            if (value) {
                selectPicker.append(`<option>${item[value]}</option>`);
            } else {
                selectPicker.append(`<option>${item}</option>`);
            }
        });
    }

    function fillDataTable(tableCellsWrapId, items) {
        const cellsWrap = $(`#${tableCellsWrapId}`);
        items.map(function (cell) {
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
        currencyNodes.map(function (currencyNode) {
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
        $(`#${accountWrapperId} .selectpicker`).on("changed.bs.select", function () {
            accounts.forEach(function (account) {
                if (account.name === this) {
                    currentAccount = account.id;
                }
            }, $(this).val());
            rerenderSelect("account-currency", accounts.get(currentAccount).currency);
            rerenderSelect("leverage", accounts.get(currentAccount).leverage);
        });
    }

    function handleCalculation(submitBtnId) {
        $(`#${submitBtnId}`).on("click", function () {
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
        $(`#${resetBtnId}`).on("click", function () {
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


    if ($("#order-transaction-volume")[0]) {
        $("#order-transaction-volume").TouchSpin({
            initval: 0.01,
            min: 0.1,
            max: 1000,
            step: 0.01,
            decimals: 2,
            boostat: 5,
            maxboostedstep: 10
        });
    }

    if ($("#order-open-price")[0]) {
        $("#order-open-price").TouchSpin({
            min: 0,
            max: 100,
            step: 0.00001,
            decimals: 5,
            boostat: 5,
            maxboostedstep: 10
        });
    }

    if ($("#order-close-price")[0]) {
        $("#order-close-price").TouchSpin({
            min: 0,
            max: 100,
            step: 0.00001,
            decimals: 5,
            boostat: 5,
            maxboostedstep: 10
        });
    }

})();