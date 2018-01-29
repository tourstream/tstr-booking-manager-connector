(function() {
    "use strict";

    const bmConnector = new window.BookingManagerConnector.default({debug: true});
    const ibeForm = document.getElementById('ibe-form');
    const actionButtons = document.getElementById('actions').getElementsByTagName('button');
    const formFieldTemplate = document.getElementById('form-field-template');

    let connection;

    init();

    function init() {
        initActionButtons();
        initFormFields();
        resetForm();
    }

    function initActionButtons() {
        Array.from(actionButtons).forEach(function(button) {
            button.onclick = function(event) {
                if (button.type === 'submit') {
                    getConnection().then(function() {
                        switch(button.name) {
                            case 'transfer-to-basket': return bmConnector.addToBasket(collectTransferData()).catch(console.log);
                            case 'transfer-to-crs': return bmConnector.directCheckout(collectTransferData()).catch(console.log);
                            case 'done': return bmConnector.done().catch(console.log);
                        }
                    });

                    return;
                }

                resetForm();
                selectProductForm(event.target.value);
            };
        });
    }

    function initFormFields() {
        let placeholderFields = document.querySelectorAll('[data-form-field]');

        Array.from(placeholderFields).forEach(function(placeholderField) {
            let formGroup = formFieldTemplate.cloneNode(true);
            let label = formGroup.childNodes[1];
            let input = formGroup.childNodes[3];

            formGroup.id = '';

            label.innerHTML = placeholderField.dataset.label;
            input.name = placeholderField.dataset.name;
            input.value = placeholderField.dataset.value
                || createDate(placeholderField.dataset.dynamicDate)
                || '';
            input.title = placeholderField.dataset.title || '';

            placeholderField.parentNode.replaceChild(formGroup, placeholderField);
        });
    }

    function createDate(daysInFuture) {
        if (!daysInFuture) {
            return;
        }

        const date = new Date(+new Date + 1000 * 60 * 60 * 24 * daysInFuture);

        return [
            date.getFullYear(),
            ('0' + (date.getMonth() + 1)).substr(-2),
            ('0' + date.getDate()).substr(-2),
        ].join('-');
    }

    function resetForm() {
        ibeForm.innerHTML = '';
    }

    function selectProductForm(type) {
        ibeForm.appendChild(document.getElementById(type + '-form-fields').cloneNode(true));
    }

    function collectTransferData() {
        let data = {};

        Object.keys(ibeForm).forEach(function(key) {
            if (!ibeForm[key].name || ibeForm[key].value === '') return;

            setValueToPropertyPath(data, ibeForm[key].name, ibeForm[key].value);
        });

        console.log('collected data: ');
        console.log(data);

        return data;
    }

    function getConnection() {
        if (!connection) {
            connection = bmConnector.connect();
        }

        return connection;
    }

    function setValueToPropertyPath(object, path, value) {
        let parts = path.split('.');
        let property = parts.shift();

        if (path === property) {
            object[property] = value === 'Infinity' ? Infinity : value;

            return;
        }

        if (isFinite(parts[0])) {
            object[property] = object[property] || [];
        } else {
            object[property] = object[property] || {};
        }

        setValueToPropertyPath(object[property], parts.join('.'), value);
    }
})();

