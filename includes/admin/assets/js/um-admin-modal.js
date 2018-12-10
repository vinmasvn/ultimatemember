function um_admin_live_update_scripts(count) {
	var metakey = jQuery('.um-admin-modal #UM_edit_field #_metakey').val();

	if ( count === 0 ) {
		jQuery('.um_add_field .um-admin-btn-toggle').hide();
	} else if ( metakey && count === 1 ) {
		jQuery('.um_add_field .um-admin-btn-toggle').hide();
	} else {
		jQuery('.um_add_field .um-admin-btn-toggle').show();
	}

	jQuery('.um-adm-conditional').each( function() {
		jQuery(this).trigger('change');
	});

	var colorpicker = jQuery('.um-admin-colorpicker');
	if ( colorpicker.length ) {
		colorpicker.wpColorPicker();
	}
}

function um_admin_new_modal( id, ajax, size ) {
	var body = jQuery('body');
	//var modal = body.find('.um-admin-overlay');
	jQuery('.tipsy').hide();
	um_admin_remove_modal();

	body.addClass('um-admin-modal-open').append('<div class="um-admin-overlay" /><div class="um-admin-modal" />');
	jQuery('#' + id).prependTo('.um-admin-modal');
	jQuery('#' + id).show();
	jQuery('.um-admin-modal').show();

	jQuery('.um-admin-modal-head').append('<a href="#" data-action="UM_remove_modal" class="um-admin-modal-close"><i class="um-faicon-times"></i></a>');

	if ( ajax == true ) {
		um_admin_modal_size( size );
		um_admin_modal_preload();
		um_admin_modal_responsive();
	} else {
		um_admin_modal_responsive();
	}
}

function um_admin_modal_ajaxcall( act_id, arg1, arg2, arg3 ) {
	var count = jQuery('.um-admin-builder .um-admin-drag-fld').length;
	var in_row = '';
	var in_sub_row = '';
	var in_column = '';
	var in_group = '';

	var col_demon = jQuery('.um-col-demon-settings');
	if ( col_demon.data('in_column') ) {
		in_row = col_demon.data('in_row');
		in_sub_row = col_demon.data('in_sub_row');
		in_column = col_demon.data('in_column');
		in_group = col_demon.data('in_group');
	}

	jQuery.ajax({
		url: wp.ajax.settings.url,
		type: 'POST',
		data: {
			action:'um_dynamic_modal_content',
			act_id: act_id,
			arg1 : arg1,
			arg2 : arg2,
			arg3: arg3,
			in_row: in_row,
			in_sub_row: in_sub_row,
			in_column: in_column,
			in_group: in_group,
			nonce: um_admin_scripts.nonce
		},
		complete: function(){
			um_admin_modal_loaded();
			um_admin_modal_responsive();
		},
		success: function(data){

			jQuery('.um-admin-modal').find('.um-admin-modal-body').html( data );

			um_responsive();

			um_admin_live_update_scripts( count );

			jQuery( "#_custom_dropdown_options_source" ).trigger('blur');

			var visible_editor = jQuery('.um-admin-editor:visible');

			if ( visible_editor.length > 0 ) {

				if ( act_id === 'um_admin_edit_field_popup' ) {

					tinyMCE.execCommand('mceRemoveEditor', true, 'um_editor_edit');
					visible_editor.html( jQuery('.um-hidden-editor-edit').contents() );
					tinyMCE.execCommand('mceAddEditor', true, 'um_editor_edit');

					jQuery('.switch-html').trigger('click').trigger('click');
					jQuery('.switch-tmce').trigger('click');

					jQuery('#um_editor_edit_ifr').height(200);

					var editor = tinyMCE.get('um_editor_edit');
					//var content = editor.getContent();
					editor.setContent( jQuery('.um-admin-modal:visible .dynamic-mce-content').html() );

				} else {
					tinyMCE.get('um_editor_new').setContent('');
					tinyMCE.execCommand('mceRemoveEditor', true, 'um_editor_new');
					visible_editor.html( jQuery('.um-hidden-editor-new').contents() );
					tinyMCE.execCommand('mceAddEditor', true, 'um_editor_new');

					jQuery('.switch-html').trigger('click').trigger('click');
					jQuery('.switch-tmce').trigger('click');

					jQuery('#um_editor_new_ifr').height(200);

				}
			}

			um_init_tooltips();
		},
		error: function(data) {

		}
	});
	return false;
}


/**
 *
 */
function um_admin_modal_responsive() {
	var visible_modal = jQuery('.um-admin-modal:visible');
	var required_margin = visible_modal.innerHeight() / 2 + 'px';
	visible_modal.css({'margin-top': '-' + required_margin });
}


/**
 *
 */
function um_admin_remove_modal() {
	var visible_editor = jQuery('.um-admin-editor:visible');
	if ( visible_editor.length > 0 ) {
		if ( jQuery('.um-admin-modal:visible').find('form').parent().attr('id') === 'UM_edit_field' ) {

			tinyMCE.execCommand('mceRemoveEditor', true, 'um_editor_edit');
			jQuery('.um-hidden-editor-edit').html( visible_editor.contents() );
			tinyMCE.execCommand('mceAddEditor', true, 'um_editor_edit');

		} else {

			tinyMCE.execCommand('mceRemoveEditor', true, 'um_editor_new');
			jQuery('.um-hidden-editor-new').html( visible_editor.contents() );
			tinyMCE.execCommand('mceAddEditor', true, 'um_editor_new');

		}
	}

	jQuery('body').removeClass('um-admin-modal-open');
	jQuery('.um-admin-modal div[id^="UM_"]').hide().appendTo('body');
	jQuery('.um-admin-modal,.um-admin-overlay').remove();
}


/**
 *
 */
function um_admin_modal_preload() {
	jQuery('.um-admin-modal:visible').addClass('loading');
	jQuery('.um-admin-modal-body:visible').empty();
}


/**
 *
 */
function um_admin_modal_loaded() {
	jQuery('.um-admin-modal:visible').removeClass('loading');
}


/**
 *
 * @param aclass
 */
function um_admin_modal_size( aclass ) {
	jQuery('.um-admin-modal:visible').addClass( aclass );
}


/**
 *
 * @param id
 * @param value
 */
function um_admin_modal_add_attr( id, value ) {
	jQuery('.um-admin-modal:visible').data( id, value );
}



// Custom modal scripting starts
jQuery(document).ready(function() {


	// disable link
	jQuery( document.body ).on('click', '.um-admin-builder a, .um-admin-modal a', function(e) {
		e.preventDefault();
		return false;
	});


	// toggle area
	jQuery( document.body ).on('click', '.um-admin-btn-toggle a', function() {
		var length = jQuery(this).parents('.um-admin-btn-toggle').find('.um-admin-cur-condition').length;

		if ( length === 5 ) {
			jQuery('.um-admin-new-condition').attr('disabled', 'disabled');
		} else {
			jQuery('.um-admin-new-condition').removeAttr('disabled');
		}
		jQuery('.condition-wrap .um-admin-cur-condition').each(function () {
			var cond_operator = jQuery(this).find('[id^="_conditional_operator"]').val();
			var cond_value = jQuery(this).find('[id^="_conditional_value"]');
			if( cond_operator === 'empty' || cond_operator === 'not empty' ){
				cond_value.attr('disabled','disabled');
			} else {
				cond_value.removeAttr('disabled');
			}
		});

		var content = jQuery(this).parent().find('.um-admin-btn-content');
		var link = jQuery(this);
		if ( content.is(':hidden') ) {
			content.show();
			link.find('i').removeClass().addClass('um-icon-minus');
			link.addClass('active');
		} else {
			content.hide();
			link.find('i').removeClass().addClass('um-icon-plus');
			link.removeClass('active');
		}
		um_admin_modal_responsive();
	});


	// check if empty/not empty
	jQuery( document.body ).on('change', 'select[id^="_conditional_operator"]', function(){
		var cond_operator = jQuery(this).val();
		var cond_value = jQuery(this).closest('.um-admin-cur-condition').find('[id^="_conditional_value"]');
		if( cond_operator === 'empty' || cond_operator === 'not empty' ){
			cond_value.attr( 'disabled', 'disabled' );
		} else {
			cond_value.removeAttr('disabled');
		}
	});


	// clone a condition
	jQuery( document.body ).on( 'click', '.um-admin-new-condition', function() {

		if ( jQuery(this).hasClass('disabled') ) {
			return false;
		}

		var content = jQuery(this).parents('.um-admin-btn-content'),
			length = content.find('.um-admin-cur-condition').length;
		if ( length >= 4 ) {
			jQuery('.um-admin-new-condition').attr('disabled', 'disabled');
		} else {
			jQuery('.um-admin-new-condition').removeAttr('disabled');
		}

		if ( length < 5 ) {
			var template;
			if ( jQuery('#UM_add_field .um-admin-btn-content .um-admin-cur-condition-template').length > 0 ) {
				template = jQuery('#UM_add_field .um-admin-btn-content').find('.um-admin-cur-condition-template').clone();
			} else {
				template = jQuery('#UM_edit_field .um-admin-btn-content').find('.um-admin-cur-condition-template').clone();
			}

			template.find('input[type=text]').val('');
			template.find('select').val('');

			if ( jQuery(this).hasClass('um-admin-new-condition-compare-and') ) {
				template.find('#_conditional_compare').val('and');
				var group = jQuery(this).prev('.um-admin-cur-condition').find('[id^="_conditional_group"]').val();

				if ( jQuery(this).prev('.um-admin-cur-condition').find('[id^="_conditional_group"]').length === 0 ) {
					group = 0;
				}

				template.find('#_conditional_group').val(group);
				//var templatehtml = template.html();
				template.insertBefore( jQuery(this) );

			} else {

				template.find('#_conditional_compare').val('or');
				var group = jQuery('.condition-wrap .um-admin-cur-condition').last().find('[id^="_conditional_group"]').val();
				template.find('#_conditional_group').val(parseInt(group)+1);
				var button = jQuery('.um-admin-new-condition-compare-and:first').clone();
				jQuery('<hr class="or-devider" />').insertBefore( jQuery(this) );
				template.insertBefore( jQuery(this) );
				button.addClass('for-remove-on-reset').insertBefore( jQuery(this) );

			}

			jQuery(template).removeClass("um-admin-cur-condition-template");
			jQuery(template).addClass("um-admin-cur-condition");

			um_admin_live_update_scripts();
			um_admin_modal_responsive();

		}

		//need fields refactor
		var conditions = jQuery('.um-admin-cur-condition');
		jQuery( conditions ).each( function( i ) {
			id = i === 0 ? '' : i;
			jQuery( this ).find('[id^="_conditional_action"]').attr('name', '_conditional_action' + id);
			jQuery( this ).find('[id^="_conditional_action"]').attr('id', '_conditional_action' + id);
			jQuery( this ).find('[id^="_conditional_field"]').attr('name', '_conditional_field' + id);
			jQuery( this ).find('[id^="_conditional_field"]').attr('id', '_conditional_field' + id);
			jQuery( this ).find('[id^="_conditional_operator"]').attr('name', '_conditional_operator' + id);
			jQuery( this ).find('[id^="_conditional_operator"]').attr('id', '_conditional_operator' + id);
			jQuery( this ).find('[id^="_conditional_value"]').attr('name', '_conditional_value' + id);
			jQuery( this ).find('[id^="_conditional_value"]').attr('id', '_conditional_value' + id);
			jQuery( this ).find('[id^="_conditional_compare"]').attr('name', '_conditional_compare' + id);
			jQuery( this ).find('[id^="_conditional_compare"]').attr('id', '_conditional_compare' + id);
			jQuery( this ).find('[id^="_conditional_group"]').attr('name', '_conditional_group' + id);
			jQuery( this ).find('[id^="_conditional_group"]').attr('id', '_conditional_group' + id);
		});
	});


	// reset conditions
	jQuery( document.body ).on('click', '.um-admin-reset-conditions a', function() {
		var content = jQuery(this).parents('.um-admin-btn-content');
		content.find('.um-admin-cur-condition').slice(1).remove();
		content.find('input[type=text]').val('');
		content.find('select').val('');

		var new_condition = jQuery('.um-admin-new-condition');
		new_condition.removeClass('disabled');
		jQuery('.condition-wrap hr').remove();
		jQuery('.condition-wrap .for-remove-on-reset').remove();
		new_condition.removeAttr('disabled');

		um_admin_live_update_scripts();
		um_admin_modal_responsive();
	});


	// remove a condition
	jQuery( document.body ).on('click', '.um-admin-remove-condition', function() {
		var and_button_clone = jQuery('.um-admin-new-condition-compare-and').clone();
		var new_condition = jQuery('.um-admin-new-condition');

		new_condition.removeAttr('disabled');
		var condition = jQuery(this).parents('.um-admin-cur-condition');
		var conditionwrap = jQuery(this).parents('.condition-wrap');
		new_condition.removeClass('disabled');
		jQuery('.tipsy').remove();

		var compare = condition.find('input[type=hidden]').val();
		if ( compare === 'or' ) {
			condition.next().find('input[type=hidden]').val(compare);
		}

		if ( condition.prev().is('hr') && condition.next().is('.um-admin-new-condition-compare-and') ){
			condition.next().remove();
			condition.prev().remove();
		}
		condition.remove();

		//need fields refactor
		var conditions = jQuery('.um-admin-cur-condition');
		jQuery( conditions ).each( function ( i ) {
			id = i === 0 ? '' : i;
			jQuery( this ).find('[id^="_conditional_action"]').attr('name', '_conditional_action' + id);
			jQuery( this ).find('[id^="_conditional_action"]').attr('id', '_conditional_action' + id);
			jQuery( this ).find('[id^="_conditional_field"]').attr('name', '_conditional_field' + id);
			jQuery( this ).find('[id^="_conditional_field"]').attr('id', '_conditional_field' + id);
			jQuery( this ).find('[id^="_conditional_operator"]').attr('name', '_conditional_operator' + id);
			jQuery( this ).find('[id^="_conditional_operator"]').attr('id', '_conditional_operator' + id);
			jQuery( this ).find('[id^="_conditional_value"]').attr('name', '_conditional_value' + id);
			jQuery( this ).find('[id^="_conditional_value"]').attr('id', '_conditional_value' + id);
			jQuery( this ).find('[id^="_conditional_compare"]').attr('name', '_conditional_compare' + id);
			jQuery( this ).find('[id^="_conditional_compare"]').attr('id', '_conditional_compare' + id);
			jQuery( this ).find('[id^="_conditional_group"]').attr('name', '_conditional_group' + id);
			jQuery( this ).find('[id^="_conditional_group"]').attr('id', '_conditional_group' + id);
		});

		conditionwrap.find('.um-admin-new-condition-compare-and').each( function() {
			console.log(jQuery(this).prev('.um-admin-cur-condition').length )
			if ( jQuery(this).prev('.um-admin-cur-condition').length === 0 ) {
				jQuery(this).remove();
			}
		});

		conditionwrap.find('.or-devider').each( function() {
			if ( jQuery(this).prev('.um-admin-new-condition-compare-and').length === 0 ) {
				jQuery(this).remove();
			}
		});

		var count_button = conditionwrap.find( '.um-admin-new-condition-compare-and' );

		if ( count_button.length === 0 ) {
			jQuery('.um-admin-new-condition-compare-or').before( and_button_clone );
		}

		um_admin_live_update_scripts();
		um_admin_modal_responsive();
	});


	// remove modal via action
	jQuery( document.body ).on('click', '.um-admin-overlay, a[data-action="UM_remove_modal"]', function() {
		um_admin_remove_modal();
	});


	// fire new modal
	jQuery( document.body ).on('click', 'a[data-modal^="UM_"], span[data-modal^="UM_"]', function(e) {
		e.preventDefault();
		var modal_id = jQuery(this).attr('data-modal');
		var fonticons = jQuery('#UM_fonticons');

		if ( jQuery(this).attr('data-back') ) {
			fonticons.find('a.um-admin-modal-back').attr("data-modal", jQuery(this).attr('data-back') );
			var current_icon = jQuery( '#' + jQuery(this).attr('data-back') ).find('input#_icon').val();
			if ( current_icon == '' ) {
				fonticons.find('.um-admin-icons span').removeClass('highlighted');
			}
		}

		if ( jQuery(this).data('dynamic-content') ) {
			um_admin_new_modal( modal_id, true, jQuery(this).data('modal-size') );
			um_admin_modal_ajaxcall( jQuery(this).data('dynamic-content'), jQuery(this).data('arg1'), jQuery(this).data('arg2'), jQuery(this).data('arg3') );
		} else {
			um_admin_new_modal( modal_id );
		}

		return false;
	});


	// choose font icon
	jQuery( document.body ).on( 'click', '.um-admin-icons span', function() {
		var icon = jQuery(this).attr('data-code');
		jQuery(this).parent().find('span').removeClass('highlighted');
		jQuery(this).addClass('highlighted');
		jQuery('#UM_fonticons').find('a.um-admin-modal-back').attr("data-code", icon);
	});


	// submit font icon
	jQuery( document.body ).on('click', '#UM_fonticons a.um-admin-modal-back:not(.um-admin-modal-cancel)', function() {
		var v_id = '';
		var icon_selected = jQuery(this).attr('data-code');
		if ( icon_selected != '' ) {
			if ( jQuery(this).attr('data-modal') ) {
				v_id = '#' + jQuery(this).attr('data-modal');
			} else {
				v_id = '.postbox';
			}
			jQuery( v_id ).find('input#_icon,input#_um_icon,input#notice__um_icon').val( icon_selected );
			jQuery( v_id ).find('span.um-admin-icon-value').html('<i class="'+icon_selected+'"></i>');
			jQuery( v_id ).find('.um-admin-icon-clear').show();
		}
		jQuery(this).attr('data-code', '');
		if ( v_id == '.postbox' ) {
			um_admin_remove_modal();
		}
	});


	// restore font icon
	jQuery( document.body ).on('click', 'span.um-admin-icon-clear', function() {
		var element = jQuery(this).parents('p');
		jQuery('#UM_fonticons a.um-admin-modal-back').attr('data-code', '');
		element.find('input[type=hidden]').val('');
		element.find('.um-admin-icon-value').html('No Icon');

		element = jQuery(this).parents('td');
		element.find('input[type=hidden]').val('');
		element.find('.um-admin-icon-value').html('No Icon');
		jQuery(this).hide();
	});


	// search font icons
	jQuery( document.body ).on('keyup blur', '#_icon_search', function() {
		if ( jQuery(this).val().toLowerCase() != '' ) {
			jQuery('.um-admin-icons span').hide();
			jQuery('.um-admin-icons span[data-code*="'+jQuery(this).val().toLowerCase()+'"]').show();
		} else {
			jQuery('.um-admin-icons span:hidden').show();
		}
		um_admin_modal_responsive();
	});


	// Retrieve options from a callback function
	jQuery( document.body ).on( 'blur',"#_custom_dropdown_options_source", function() {
		var me = jQuery(this);
		var _options = jQuery('textarea[id="_options"]');

		if ( me.val() != '' ) {
			var um_option_callback = me.val();
			jQuery.ajax({
				url: wp.ajax.settings.url,
				type: 'POST',
				data: {
					action:'um_populate_dropdown_options',
					um_option_callback: um_option_callback,
					nonce: um_admin_scripts.nonce
				},
				complete: function() {

				},
				success: function( response ) {
					var arr_opts = [];

					for (var key in response.data ) {
						arr_opts.push( response.data[ key ] );
					}

					_options.val( arr_opts.join('\n') );
				}
			});
		}

	});

});