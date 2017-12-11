(() => {
    "use strict";

    const bmConnector = new window.BookingManagerConnector.default({debug: true});
    const ibeForm = document.getElementById('ibe-form');
    const actionButtons = document.getElementById('actions').getElementsByTagName('button');
    const formFieldTemplate = document.getElementById('form-field-template');

    init();

    function init() {
        initActionButtons();
        initFormFields();
        resetForm();
    }

    function initActionButtons() {
        Array.from(actionButtons).forEach((button) => {
            button.onclick = (event) => {
                if (button.type === 'submit') {
                    sendData();
                    return;
                }

                resetForm();
                selectProductForm(event.target.value);
            };
        });
    }

    function initFormFields() {
        let placeholderFields = document.querySelectorAll('[data-form-field]');

        placeholderFields.forEach((placeholderField) => {
            let formGroup = formFieldTemplate.cloneNode(true);
            let label = formGroup.childNodes[1];
            let input = formGroup.childNodes[3];

            formGroup.id = '';

            label.innerHTML = placeholderField.dataset.label;
            input.name = placeholderField.dataset.name;
            input.value = placeholderField.dataset.value || '';
            input.title = placeholderField.dataset.title || '';

            placeholderField.parentNode.replaceChild(formGroup, placeholderField);
        });
    }

    function resetForm() {
        ibeForm.innerHTML = '';
    }

    function selectProductForm(type) {
        ibeForm.appendChild(document.getElementById(type + '-form-fields').cloneNode(true));
    }

    function sendData() {
        let data = {};

        Object.keys(ibeForm).forEach((key) => {
            if (!ibeForm[key].name) return;

            setValueToPropertyPath(data, ibeForm[key].name, ibeForm[key].value);
        });

        console.log('collected data', data);

        Promise.resolve(bmConnector.connect()).then(() => {
            let decision = window.prompt('Send [1] for a direct checkout else it will be added to the basket');

            if (decision === '1') {
                bmConnector.directCheckout(data).catch(console.log);
                return;
            }

            bmConnector.addToBasket(data).catch(console.log);
        }, console.log);
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

