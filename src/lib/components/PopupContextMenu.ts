import type { PopupSettings } from '@skeletonlabs/skeleton';

export interface ContextMenuSettings extends Omit<PopupSettings, 'event'> {
    /** Provide the event type. */
    event: 'contextmenu';
}

export function popupContextMenu(triggerNode: HTMLElement, args: ContextMenuSettings) {
    // pos is cursor position when right click occur
    let pos = { x: 0, y: 0 }
    // menu is dimension (height and width) of context menu
    let menu = { h: 0, w: 0 }
    // browser/window dimension (height and width)
    let browser = { h: 0, w: 0 }

	// Local State
	const popupState = {
		open: false,
		autoUpdateCleanup: () => {}
	};
    const focusableAllowedList = ':is(a[href], button, input, textarea, select, details, [tabindex]):not([tabindex="-1"])';
	let focusablePopupElements: HTMLElement[];
	// Elements
	let elemPopup: HTMLElement;
	let elemArrow: HTMLElement;

	function setDomElements(): void {
		elemPopup = document.querySelector(`[data-popup="${args.target}"]`) ?? document.createElement('div');
		elemArrow = elemPopup.querySelector(`.arrow`) ?? document.createElement('div');
	}
	setDomElements(); // init


    function rightClickContextMenu(e: MouseEvent){
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        pos = {
            x: e.clientX,
            y: e.clientY
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        menu = { h: elemPopup.clientHeight, w: elemPopup.clientWidth }

        if (browser.h - pos.y < menu.h)
            pos.y = pos.y - menu.h
        if (browser.w - pos.x < menu.w)
            pos.x = pos.x - menu.w
    }

	// Render Popup
	function render(): void {
        Object.assign(elemPopup.style, {
            left: `${pos.x}px`,
            top: `${pos.y}px`
        });
	}

	// State Handlers
	function open(ev: MouseEvent): void {
        if (!elemPopup) return;

        
		// Set open state to on
		popupState.open = true;
		// Return the current state
		if (args.state) args.state({ state: popupState.open });
		// Update the DOM
		elemPopup.style.display = 'block';
		elemPopup.style.pointerEvents = 'auto';
		elemPopup.style.position = 'absolute';
        
        rightClickContextMenu(ev)
		// Update render settings
		render();

        // opacity 1 after elemPopup render for h w computation (get client size) to avoid it display at unexpected position 
		elemPopup.style.opacity = '1';
		// enable popup interactions
		elemPopup.removeAttribute('inert');

		// Focus the first focusable element within the popup
		focusablePopupElements = Array.from(elemPopup?.querySelectorAll(focusableAllowedList));
	}
	function close(callback?: () => void): void {
		if (!elemPopup) return;
		// Set transition duration
		const cssTransitionDuration = parseFloat(window.getComputedStyle(elemPopup).transitionDuration.replace('s', '')) * 100;
		setTimeout(() => {
			// Set open state to off
			popupState.open = false;
			// Return the current state
			if (args.state) args.state({ state: popupState.open });
			// Update the DOM
			elemPopup.style.opacity = '0';
			// disable popup interactions
			elemPopup.setAttribute('inert', '');
			// Trigger callback
			if (callback) callback();
		}, cssTransitionDuration);
	}

	function onWindowClick(event: any): void {
		// Return if the popup is not yet open
		if (popupState.open === false) return;
		// Return if click is the trigger element
		if (triggerNode.contains(event.target)) return;
		// If click it outside the popup
		if (elemPopup && elemPopup.contains(event.target) === false) {
			close();
			return;
		}
		// Handle Close Query State
		const closeQueryString: string = args.closeQuery === undefined ? 'a[href], button' : args.closeQuery;
		const closableMenuElements = elemPopup?.querySelectorAll(closeQueryString);
        
		closableMenuElements?.forEach((elem) => {
			if (elem.contains(event.target)) close();
		});
	}

	// Keyboard Interactions for A11y
	const onWindowKeyDown = (event: KeyboardEvent): void => {
		if (popupState.open === false) return;
		// Handle keys
		const key: string = event.key;
		// On Esc key
		if (key === 'Escape') {
			event.preventDefault();
			triggerNode.focus();
			close();
			return;
		}
	};

	// Event Listeners
	switch (args.event) {
		case 'contextmenu':
			triggerNode.addEventListener('contextmenu', open, true);
			window.addEventListener('click', onWindowClick, true);
			window.addEventListener('contextmenu', onWindowClick, true);
			break;
		default:
			throw new Error(`Event value of '${args.event}' is not supported.`);
	}
	window.addEventListener('keydown', onWindowKeyDown, true);

	// Render popup on initialization
	render();

	// Lifecycle
	return {
		update(newArgs: ContextMenuSettings) {
			close(() => {
				args = newArgs;
				render();
				setDomElements();
			});
		},
		destroy() {
			// Trigger Events
			triggerNode.removeEventListener('contextmenu', open, true);
			// Window Events
			window.removeEventListener('click', onWindowClick, true);
			window.removeEventListener('contextmenu', onWindowClick, true);
			window.removeEventListener('keydown', onWindowKeyDown, true);
		}
	};
}