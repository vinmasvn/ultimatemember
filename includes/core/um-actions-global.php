<?php if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


/**
 * Adds a form identifier to form
 *
 * @param $args
 */
function um_add_form_identifier( $args ) {
	$new_cond = get_post_meta( $args['form_id'], '_um_has_new_cond', true );

	$form_cond_class = '';
	if( isset( $new_cond ) && $new_cond == '1' ) {
		$form_cond_class = 'new-cond-form';
	}

	$conditional_array = array();
	if( ! empty( $args['custom_fields'] ) ){
		foreach ( $args['custom_fields'] as $arg ) {
			if ( isset( $arg['conditions'] ) ) {
				$conditional_array[ $arg['metakey'] ] = $arg['conditions'];
			}
		}
		$cond_data = json_encode( $conditional_array );
	}
	?>
		<input type="hidden" name="form_id" id="form_id_<?php echo esc_attr( $args['form_id'] ); ?>" value="<?php echo esc_attr( $args['form_id'] ); ?>" class="condition-data <?php echo esc_attr( $form_cond_class ); ?>" data-conds="<?php echo esc_attr( $cond_data ); ?>" />
	<?php
}
add_action( 'um_after_form_fields', 'um_add_form_identifier' );


/**
 * Adds a spam timestamp
 *
 * @param $args
 */
function um_add_security_checks( $args ) {
	if ( is_admin() ) {
		return;
	} ?>

	<input type="hidden" name="timestamp" class="um_timestamp" value="<?php echo esc_attr( current_time( 'timestamp' ) ) ?>" />

	<p class="<?php echo esc_attr( UM()->honeypot ); ?>_name">
		<label for="<?php echo esc_attr( UM()->honeypot ) . '_' . $args['form_id']; ?>"><?php _e( 'Only fill in if you are not human' ); ?></label>
		<input type="text" name="<?php echo esc_attr( UM()->honeypot ); ?>" id="<?php echo esc_attr( UM()->honeypot ) . '_' . $args['form_id']; ?>" class="input" value="" size="25" autocomplete="off" />
	</p>

	<?php
}
add_action( 'um_after_form_fields', 'um_add_security_checks' );
add_action( 'um_account_page_hidden_fields', 'um_add_security_checks' );


/**
 * Makes the honeypot invisible
 */
function um_add_form_honeypot_css() {
	?>
		<style type="text/css">
			.<?php echo esc_attr( UM()->honeypot ); ?>_name {
				display: none !important;
			}
		</style>
	<?php
}
add_action( 'wp_head', 'um_add_form_honeypot_css' );

/**
 * Empty the honeypot value
 */
function um_add_form_honeypot_js() {
	?>
		<script type="text/javascript">
			jQuery( '#<?php echo esc_js( UM()->honeypot ); ?>' ).val( '' );
		</script>
	<?php
}
add_action( 'wp_footer', 'um_add_form_honeypot_js', 99999999999999999 );