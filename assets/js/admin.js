var Admin = function (){    /// <summary>Constructor function of the event admin class.</summary>    /// <returns type="Home" />    // Uploading files    var file_frame;    var file_target_input;    var file_target_wrapper;    return {        ///<summary>        ///Initializes the admin.        ///</summary>        ///<returns type="initialization settings" />        /// <since>1.0.0</since>        init: function ()        {            //Tooltips            jQuery(".tips, .help_tip").tipTip({                'attribute': 'data-tip',                'fadeIn': 50,                'fadeOut': 50,                'delay': 200            });            //load chosen            if (jQuery(".event-manager-select-chosen").length > 0)            {                jQuery(".event-manager-select-chosen").chosen();            }            //time settings change            jQuery('input[name=_event_time_format]').on('change', Admin.actions.showSelectedTimeFormat);            var min_date;            if (wp_event_manager_admin_js.show_past_date)            {                min_date = '';            }             else            {                min_date = 0;            }            if (jQuery('input[data-picker="datepicker"]#_event_start_date').length > 0)            {                jQuery('input[data-picker="datepicker"]#_event_start_date').datepicker({                    minDate: min_date,                    dateFormat: wp_event_manager_admin_js.i18n_datepicker_format,                });            }            if (jQuery('input[data-picker="datepicker"]#_event_end_date').length > 0)            {                jQuery('input[data-picker="datepicker"]#_event_end_date').datepicker({                    dateFormat: wp_event_manager_admin_js.i18n_datepicker_format,                    beforeShow: function (input, inst)                    {                        var mindate = jQuery('input[data-picker="datepicker"]#_event_start_date').datepicker('getDate');                        jQuery(this).datepicker('option', 'minDate', mindate);                    }                });            }            if (jQuery('#_event_start_time').length > 0)            {                jQuery('#_event_start_time').timepicker({                    'timeFormat': wp_event_manager_admin_js.i18n_timepicker_format,                    'step': wp_event_manager_admin_js.i18n_timepicker_step,                });            }            if (jQuery('#_event_end_time').length > 0)            {                jQuery('#_event_end_time').timepicker({                    'timeFormat': wp_event_manager_admin_js.i18n_timepicker_format,                    'step': wp_event_manager_admin_js.i18n_timepicker_step,                });            }            if (jQuery('#_event_timezone').length > 0)            {                jQuery("#_event_timezone").chosen({search_contains: !0});            }            if (jQuery('input[data-picker="datepicker"]#_event_registration_deadline').length > 0)            {                jQuery('input[data-picker="datepicker"]#_event_registration_deadline').datepicker({                    minDate: min_date,                    maxDate: jQuery('#_event_end_date').val(),                    dateFormat: wp_event_manager_admin_js.i18n_datepicker_format,                });            }            /*show default value of the expiry date based on settings */            if (jQuery('input[data-picker="datepicker"]#_event_expiry_date').length > 0)            {                jQuery('input#_event_expiry_date').datepicker({                    minDate: min_date,                    dateFormat: wp_event_manager_admin_js.i18n_datepicker_format,                    beforeShow: function (input, inst)                    {                        var mindate = jQuery('input[data-picker="datepicker"]#_event_end_date').datepicker('getDate');                        jQuery(this).datepicker('option', 'minDate', mindate);                    }                });            }            //if field type is date then load datepicker            if (jQuery('input[data-picker="datepicker"]').length > 0)            {                jQuery('input[data-picker="datepicker"]').datepicker({minDate: 0, dateFormat: wp_event_manager_admin_js.i18n_datepicker_format});            }            //Author            jQuery("p.form-field-author").on('click', Admin.author.changeAuthor);            jQuery("#setting-event_manager_submission_expire_options").on('change', Admin.settings.selectEventExpiryOption);            //file upload            jQuery(".wp_event_manager_upload_file_button").on('click', Admin.fileUpload.addFile);            jQuery(".wp_event_manager_add_another_file_button").on('click', Admin.fileUpload.addAnotherFile);            //upgrade database            jQuery("#wp_event_manager_upgrade_database").on('click', Admin.actions.upgradeDatabase);        },        actions:                {                    /// <summary>                    /// Show selected time format : 12 hour format or 24 hour format.                    /// </summary>                    /// <returns type="initialization settings" />                    /// <since>1.0.0</since>                    showSelectedTimeFormat: function (event)                    {                        event.preventDefault();                        if (jQuery('input[name="_event_time_format"]').length > 0)                        {                            Admin.timeFormatSettings();                        }                    },                    /// <summary>                    /// upgrade database when we create seperate post type for Organiizer                    /// </summary>                    /// <since>3.1.14</since>                    upgradeDatabase: function (event)                    {                        jQuery.ajax({                            url: wp_event_manager_admin_js.ajax_url,                            type: 'POST',                            dataType: 'json',                            data: {                                action: 'wpem_upgrade_database',                            },                            beforeSend: function() {                                jQuery('.update-message').remove();                                jQuery('hr.wp-header-end.extra').remove();                                jQuery('.wp_event_manager_upgrade_database').before('<div class="update-message notice inline notice-warning notice-alt updating-message"><p>' + wp_event_manager_admin_js.upgrade_database_before_send_text + '...</p></div><hr class="wp-header-end extra">');                            },                            success: function (responce)                            {                                jQuery('.update-message').remove();                                jQuery('hr.wp-header-end.extra').remove();                                jQuery('.wpem-upgrade-database-notice').remove();                                jQuery('.wp_event_manager_upgrade_database').before('<div class="update-message notice inline notice-alt updated-message notice-success"><p>' + wp_event_manager_admin_js.upgrade_database_success_send_text + '</p></div><hr class="wp-header-end extra">');                                jQuery('.wp_event_manager_upgrade_database').remove();                            }                        });                    },                },        author:                {                    /// <summary>                    /// Change Author.                    /// </summary>                    /// <param name="parent" type="Event"></param>                    /// <returns type="actions" />                    /// <since>1.0.0</since>                    changeAuthor: function (event)                    {                        jQuery(this).closest('p').find('.current-author').hide();                        jQuery(this).closest('p').find('.change-author').show();                        return false;                        event.preventDefault();                    },                },        settings:                {                    /// <summary>                    /// You can set event submission expiry time either event end date or specific days..                    /// </summary>                    /// <param name="parent" type="Event"></param>                    /// <returns type="actions" />                    /// <since>1.0.0</since>                    selectEventExpiryOption: function (event)                    {                        var option = jQuery("#setting-event_manager_submission_expire_options option:selected").val();                        if (option == 'days')                            jQuery('#setting-event_manager_submission_duration').closest('tr').show();                        else                            jQuery('#setting-event_manager_submission_duration').closest('tr').hide();                        event.preventDefault();                    }                },        fileUpload:                {                    /// <summary>                    /// Upload new file from admin area.                    /// </summary>                    /// <param name="parent" type="Event"></param>                    /// <returns type="actions" />                    /// <since>1.0.0</since>                    addFile: function (event)                    {                        event.preventDefault();                        file_target_wrapper = jQuery(this).closest('.file_url');                        file_target_input = file_target_wrapper.find('input');                        // If the media frame already exists, reopen it.                        if (file_frame)                        {                            file_frame.open();                            return;                        }                        // Create the media frame.                        file_frame = wp.media.frames.file_frame = wp.media({                            title: jQuery(this).data('uploader_title'),                            button: {                                text: jQuery(this).data('uploader_button_text'),                            },                            multiple: false  // Set to true to allow multiple files to be selected                        });                        // When an image is selected, run a callback.                        file_frame.on('select', function ()                        {                            // We set multiple to false so only get one image from the uploader                            attachment = file_frame.state().get('selection').first().toJSON();                            jQuery(file_target_input).val(attachment.url);                        });                        // Finally, open the modal                        file_frame.open();                    },                    /// <summary>                    /// Upload new file from admi area. when admin want to add another file then admin can add new file.                    /// </summary>                    /// <param name="parent" type="Event"></param>                    /// <returns type="actions" />                    /// <since>1.0.0</since>                    addAnotherFile: function (event)                    {                        event.preventDefault();                        var wrapper = jQuery(this).closest('.form-field');                        var field_name = jQuery(this).data('field_name');                        var field_placeholder = jQuery(this).data('field_placeholder');                        var button_text = jQuery(this).data('uploader_button_text');                        var button = jQuery(this).data('uploader_button');                        jQuery(this).before('<span class="file_url"><input type="text" name="' + field_name + '[]" placeholder="' + field_placeholder + '" /><button class="button button-small wp_event_manager_upload_file_button" data-uploader_button_text="' + button_text + '">' + button + '</button></span>');                    }                }    } //enf of return}; //end of classAdmin = Admin();jQuery(document).ready(function ($){    Admin.init();});