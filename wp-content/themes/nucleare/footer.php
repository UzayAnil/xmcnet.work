<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after
 *
 * @package nucleare
 */
?>

	</div><!-- #content -->
	<?php if ( ! function_exists( 'elementor_theme_do_location' ) || ! elementor_theme_do_location( 'footer' ) ) : ?>
		<footer id="colophon" class="site-footer">
			<div class="site-info smallPart">
				<?php $copyrightText = get_theme_mod('nucleare_theme_options_copyright', '&copy; '.date('Y').' '. get_bloginfo('name')); ?>
				<?php echo wp_kses($copyrightText, nucleare_allowed_html()); ?>
				<span class="sep"> | </span>
				<?php
				/* translators: 1: theme name, 2: theme developer */
				printf( esc_html__( 'WordPress Theme: %1$s by %2$s.', 'nucleare' ), '<a target="_blank" href="https://crestaproject.com/downloads/nucleare/" rel="nofollow" title="Nucleare Theme">Nucleare</a>', 'CrestaProject' );
				?>
			</div><!-- .site-info -->
			<div class="footer-menu smallPart">
				<?php wp_nav_menu( array( 'theme_location' => 'footer', 'menu_id' => 'footer-menu', 'depth' => '1', 'fallback_cb' => false ) ); ?>
			</div>
		</footer><!-- #colophon -->
	<?php endif; ?>
</div><!-- #page -->
<?php $scrollToTopMobile = get_theme_mod('nucleare_theme_options_scroll_top', ''); ?>
<a href="#top" id="toTop" class="<?php echo $scrollToTopMobile ? 'scrolltop_on' : 'scrolltop_off' ?>"><i class="fa fa-angle-up fa-lg"></i></a>
<?php wp_footer(); ?>

</body>
</html>
