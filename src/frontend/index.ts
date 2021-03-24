import Z2mHelper from './helper';

declare global {
  interface Window {
    Z2mHelper: Z2mHelper;
  }
}

window.Z2mHelper = Z2mHelper;
