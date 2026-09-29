<script lang="ts">
	import type { Attachment } from 'svelte/attachments';

	/**
	 * Hero-only split mark: the logo is two stacked paths (upper / lower blades)
	 * that meet at the right tip. Each half rotates around that hinge for a wing flap.
	 * Nav/footer keep the intact `logo.svg`.
	 */
	const flapWings: Attachment<SVGSVGElement> = (node) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let cancelled = false;
		let ctx: { revert: () => void } | undefined;

		void import('gsap').then(({ default: gsap }) => {
			if (cancelled) return;

			const upper = node.querySelector<SVGGElement>('[data-wing="upper"]');
			const lower = node.querySelector<SVGGElement>('[data-wing="lower"]');
			if (!upper || !lower) return;

			ctx = gsap.context(() => {
				// Root-SVG user space (viewBox): tip sits near the right, upper third of the mark
				const box = node.getBBox();
				const ox = box.x + box.width * 0.94;
				const oy = box.y + box.height * 0.22;
				const origin = `${ox} ${oy}`;

				gsap.set([upper, lower], { svgOrigin: origin, force3D: true });
				gsap.set(node, { force3D: true });

				const tl = gsap.timeline({ defaults: { ease: 'sine.inOut' } });

				tl.from(node, { y: 8, opacity: 0.88, duration: 0.1, ease: 'power2.out' });

				const flaps: Array<{ deg: number; dur: number }> = [
					{ deg: 22, dur: 0.08 },
					{ deg: 16, dur: 0.075 },
					{ deg: 10, dur: 0.07 },
					{ deg: 5, dur: 0.065 }
				];

				for (const { deg, dur } of flaps) {
					tl.to(upper, { rotation: -deg, duration: dur });
					tl.to(lower, { rotation: deg, duration: dur }, '<');
					tl.to(upper, { rotation: 0, duration: dur });
					tl.to(lower, { rotation: 0, duration: dur }, '<');
				}

				tl.to(node, {
					y: 0,
					duration: 0.16,
					ease: 'power2.out',
					clearProps: 'transform,opacity'
				});
				tl.set([upper, lower], { clearProps: 'transform' });
			}, node);

			if (cancelled) ctx.revert();
		});

		return () => {
			cancelled = true;
			ctx?.revert();
		};
	};
</script>

<svg
	{@attach flapWings}
	class="hero-logo size-28 shrink-0 sm:size-36 md:size-40 lg:size-44"
	viewBox="0 0 500 500"
	width="176"
	height="176"
	role="img"
	aria-label="Menzies"
	overflow="visible"
>
	<title>Menzies</title>
	<defs>
		<linearGradient
			id="menzies-flap-fill-a"
			gradientUnits="userSpaceOnUse"
			x1="58.737499"
			y1="210.36667"
			x2="359.6636"
			y2="210.36667"
			gradientTransform="matrix(1.0359649 0 0 1.0385901 33.622507 47.214912)"
		>
			<stop offset="0" stop-color="#000efc" stop-opacity="1" />
			<stop offset="1" stop-color="#b85ce5" stop-opacity="0.341" />
		</linearGradient>
		<linearGradient
			id="menzies-flap-fill-b"
			gradientUnits="userSpaceOnUse"
			x1="58.737499"
			y1="210.36667"
			x2="359.6636"
			y2="210.36667"
			gradientTransform="matrix(1.0437414 -0.19443503 0.19394358 1.0463863 3.9695416 116.22272)"
		>
			<stop offset="0" stop-color="#0907ff" stop-opacity="1" />
			<stop offset="1" stop-color="#8b49e1" stop-opacity="0.358" />
		</linearGradient>
	</defs>

	<!-- Original Inkscape nesting preserved so paths match logo.svg -->
	<g transform="translate(-0.08510412,-70.39898)">
		<g transform="translate(0.1838503,-40.74251)">
			<g transform="matrix(1.5329726,0,0,1.5329726,-134.11622,-85.269094)">
				<g data-wing="upper">
					<path
						fill="url(#menzies-flap-fill-a)"
						d="m 94.472502,205.49605 c 149.109898,99.47528 303.153578,0 303.153578,0 0,0 -325.90825,165.29244 -250.63845,145.07287 75.26978,-20.21959 187.59567,-85.71745 251.73485,-145.07287 64.13918,-59.35544 -304.249978,0 -304.249978,0 z"
					/>
				</g>
				<g data-wing="lower">
					<path
						fill="url(#menzies-flap-fill-b)"
						d="M 133.16253,264.27136 C 301.96745,336.50767 400.26246,207.374 400.26246,207.374 c 0,0 -297.48837,227.70126 -225.42934,193.20291 72.05906,-34.49837 172.99723,-121.56977 226.53398,-193.40869 53.53675,-71.83893 -268.20457,57.10314 -268.20457,57.10314 z"
					/>
				</g>
			</g>
		</g>
	</g>
</svg>
