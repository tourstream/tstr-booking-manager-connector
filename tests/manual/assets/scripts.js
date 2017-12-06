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
            input.value = placeholderField.dataset.value;
            input.title = placeholderField.dataset.title || '';

            placeholderField.parentNode.replaceChild(formGroup, placeholderField);
        });
    }

    function resetForm() {
        ibeForm.innerHTML = '';
        ibeForm.appendChild(document.getElementById('base-form-fields').cloneNode(true));
    }

    function selectProductForm(type) {
        ibeForm.appendChild(document.getElementById(type + '-form-fields').cloneNode(true));
    }

    function sendData() {
        let data = {};
        let service = {};

        Object.keys(ibeForm).forEach((key) => {
            if (ibeForm[key].name.indexOf('service.') === 0) {
                service[ibeForm[key].name.split('.')[1]] = ibeForm[key].value;
            } else if (ibeForm[key].name.indexOf('children.') === 0) {
                service.children = service.children || [];

                let value = ibeForm[key].value;

                if (!value) return;

                let index = ibeForm[key].name.split('.')[1];
                let child = service.children[index] || {};

                child[ibeForm[key].name.split('.')[2]] = value;

                service.children[index] = child;
            } else if (ibeForm[key].name.indexOf('extra.') === 0) {
                if (!service.extras) {
                    service.extras = [];
                }

                service.extras.push(ibeForm[key].value);
            } else {
                data[ibeForm[key].name] = ibeForm[key].value;
            }
        });

        data.services = [service];

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
})();

