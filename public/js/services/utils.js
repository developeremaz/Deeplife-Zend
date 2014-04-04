skeletonServices.service('Utils', function() {
    this.getIdFromUrl = function(absUrl) {
        var id = null;
        var url = absUrl.split("/");
        url = url.splice(3, url.length-3); // Remove start of url

        // Here we should have at least 2 items in the array. If not, it's the root and we won't have
        // any id provied.
        if(url.length > 1 && !isNaN(parseFloat(url[url.length-1])) && isFinite(url[url.length-1]))
            id = url[url.length-1]; // ID is last argument

        return id;
    };

    this.formErrorMessages = function(messages, inputs) {
        angular.forEach(messages, function(message, input) {
            var inputInError = $.grep($(inputs), function(e) { return e.name == input; });
            var errorMessage = $(inputInError).closest('div[class^="form-group"]').find('.errors').removeClass('hide');
            var appendedMessage = "";
            angular.forEach(message, function(msg) {
                appendedMessage += msg + '\n<br/>';
            });

            $(errorMessage).html(appendedMessage);
            $(inputInError).parent().addClass('.has-error');
        });

        return true;
    };

    this.JSONObjFromInputs = function(inputs) {
        var data = {};
        angular.forEach(inputs, function(input) {
            var el = $(input);
            var name = el.attr('name');
            var type = el.attr('type');
            var multiple = el.attr('multiple');
            var value;

            // Remove the brackets from array input
            if(name && name.indexOf('[') !== -1 && name.indexOf(']') !== -1)
                name = name.substr(0, name.indexOf('['));

            // We need to check 'checked' on checkboxes
            if(type === "checkbox")
                value = el.prop('checked');
            else if(multiple)
                value = el.val();
            else
                value = el.val().trim();

            if(name !== undefined && value !== undefined)
                data[name] = value;
        });

        return data;
    };

    this.formatDataToSelect = function(data, outputField, selected) {
        var out = {};

        // Format each item to be
        // {id: outputFieldValue}
        angular.forEach(data, function(item) {
            var output = "";

            if(typeof outputField === "object") {
                angular.forEach(outputField, function(outField) {
                    if(output.length !== 0) output += "-";
                    output += item[outField];
                });
            } else {
                output = item[outputField];
            }
            out[item.id] = output;
        });

        // Add selected item if selected
        if(selected)
            out.selected = selected.id;

        return out;
    };

    this.openModal = function(selector, initField, initValue) {
        var modal = $(selector);

        if(initField && initValue)
            modal.find("input[name='"+initField+"']").val(initValue);

        modal.find(".errors").addClass('hide').html("");
        modal.modal("show");
    };

    this.disable = function(selector) {
        $(selector).prop("disabled",!$(selector).prop("disabled"));
    };

    this.JSONObjFromForm = function(form) {
        var o = {};
        var a = form.serializeArray();
        $.each(a, function() {
            if(this.name.indexOf('[') != -1) {
                var parts = this.name.split('[');
                var left = parts[0];
                var right = parts[1].substr(0, parts[1].length-1);
                if (o[left] !== undefined) {
                    o[left][right] = this.value || '';
                } else {
                    o[left] = {};
                    o[left][right] = this.value || '';
                }
            } else {
                addToArray(o, this);
            }
        });
        return o;
    };

    function addToArray(array, object) {
        if (array[object.name] !== undefined) {
            if (!array[object.name].push) {
                array[object.name] = [array[object.name]];
            }
            array[object.name].push(object.value || '');
        } else {
            array[object.name] = object.value || '';
        }
    }
});
