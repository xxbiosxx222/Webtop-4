
export class WindowManager {
  constructor() {
    this.windows = new Map();
    this.activeWindow = null;
    this.windowIdCounter = 0;
    this.taskList = window.parent.document.getElementById('task-list');
  }
injectLiquidGlassSVG() {
    if (window.parent.document.getElementById('effectSvg')) return;

    const svgContainer = window.parent.document.createElement('div');
    svgContainer.style.position = 'absolute';
    svgContainer.style.top = '-999px';
    svgContainer.style.left = '-999px';
    svgContainer.innerHTML = `
        <svg width="0" height="0" color-interpolation-filters="sRGB">
  <filter id="glass">
    <feComponentTransfer result="SourceBackground" in="SourceGraphic">
      <feFuncR type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncR>
      <feFuncG type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncG>
      <feFuncB type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncB>
    </feComponentTransfer>

    <feComponentTransfer>
      <feFuncR type="linear" slope=".9" intercept="0.05"></feFuncR>
      <feFuncG type="linear" slope=".9" intercept="0.05"></feFuncG>
      <feFuncB type="linear" slope=".9" intercept="0.05"></feFuncB>
    </feComponentTransfer>

    <feGaussianBlur result="gaussian-blur-0" stdDeviation="8"></feGaussianBlur>
    <feComponentTransfer result="SourceMask" in="SourceGraphic">
      <feFuncR type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncR>
      <feFuncG type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncG>
      <feFuncB type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncB>
    </feComponentTransfer>
    <feComposite result="composite-1" in="SourceMask" in2="none"></feComposite>
    <feColorMatrix result="SourceMask" in="composite-1" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 -1 -1 1 0"></feColorMatrix>
    <feComposite result="balls-masked" in="gaussian-blur-0" in2="SourceMask" operator="out"></feComposite>

    <feColorMatrix result="color-matrix-0" in="balls-masked" values="0 0 0 0 0.3 0 0 0 0 0.3 0 0 0 0 0.3 0 0 0 1 0"></feColorMatrix>
    <feMorphology result="morphology-0" in="color-matrix-0" radius="1.5"></feMorphology>
    <feComposite result="composite-4" in="balls-masked" in2="morphology-0" operator="out"></feComposite>
    <feColorMatrix result="color-matrix-2" in="composite-4" values="2 0 0 0 0 0 2 0 0 0 0 0 2 0 0 0 0 0 0.2 0"></feColorMatrix>
    <feComposite result="composite-3" in="color-matrix-2" in2="balls-masked" operator="over"></feComposite>

    <feDropShadow dx="1" stdDeviation="5" dy="1" style="flood-opacity: 0.3"></feDropShadow>

    <feComposite in2="SourceBackground"></feComposite>
  </filter>

  <!-- 🫧🫧🫧🫧🫧🫧 -->

  <filter id="liquid-glass" x="-20%" y="-20%" width="140%" height="140%">
    <!-- #region Unpacking Sources -->

    <!-- Unpack Upper channel - Background  (XXXX XXX0) -->
    <feComponentTransfer result="SourceBackground" in="SourceGraphic">
      <feFuncR type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncR>
      <feFuncG type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncG>
      <feFuncB type="discrete" tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"></feFuncB>
    </feComponentTransfer>

    <!-- Unpack Lower channel - Mask (0000 000X) -->
    <feComponentTransfer in="SourceGraphic">
      <feFuncR type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncR>
      <feFuncG type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncG>
      <feFuncB type="discrete" tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"></feFuncB>
    </feComponentTransfer>

    <feColorMatrix type="luminanceToAlpha"></feColorMatrix>

    <!-- FXAAAAAA -->
    <feGaussianBlur stdDeviation="2"></feGaussianBlur>
    <!-- alpha minus + sharpen -->
    <feColorMatrix values="
            1 0 0 0 1
            0 1 0 0 1 
            0 0 1 0 1 
            0 0 0 8 -2"></feColorMatrix>
    <feComposite result="SourceMask"></feComposite>

    <!-- #endregion -->

    <!-- #region Red (top) -->
    <feDiffuseLighting result="diffuse-lighting-0" in="SourceMask" diffuseConstant="1" surfaceScale="100" style="">
      <feDistantLight azimuth="90" elevation="180"></feDistantLight>
    </feDiffuseLighting>
    <feColorMatrix result="color-matrix-0" in="diffuse-lighting-0" type="luminanceToAlpha"></feColorMatrix>
    <feColorMatrix result="side-red" in="color-matrix-0" values="
          0 0 0 0.0 1 
          0 0 0 0.0 0 
          0 0 0 0.0 0 
          0 0 0 255 0"></feColorMatrix>
    <!-- #endregion -->

    <!-- #region Green (left) -->
    <feDiffuseLighting result="diffuse-lighting-1" in="SourceMask" diffuseConstant="1" surfaceScale="100">
      <feDistantLight azimuth="0" elevation="180"></feDistantLight>
    </feDiffuseLighting>
    <feColorMatrix result="color-matrix-3" in="diffuse-lighting-1" type="luminanceToAlpha"></feColorMatrix>
    <feColorMatrix result="side-green" in="color-matrix-3" values="
            0 0 0 0.0 0 
            0 0 0 0.0 1 
            0 0 0 0.0 0 
            0 0 0 255 0"></feColorMatrix>
    <!-- #endregion -->

    <!-- #region Black (bottom) -->
    <feDiffuseLighting in="SourceMask" diffuseConstant="1" surfaceScale="100">
      <feDistantLight azimuth="270" elevation="180"></feDistantLight>
    </feDiffuseLighting>
    <feColorMatrix result="color-matrix-5" type="luminanceToAlpha"></feColorMatrix>
    <feColorMatrix result="side-black" in="color-matrix-5" values="
            0 0 0 0.0 0 
            0 0 0 0.0 0 
            0 0 0 0.0 0 
            0 0 0 255 0"></feColorMatrix>
    <!-- #endregion -->

    <!-- #region Normal Map Creation -->
    <feBlend result="top-left" in="side-green" in2="side-red" mode="screen"></feBlend>
    <feBlend result="top-left-bottom" in="side-black" in2="top-left" mode="screen"></feBlend>

    <!-- CONTROLS -->
    <feMorphology result="thickness" in="top-left-bottom" radius="2" operator="dilate"></feMorphology>
    <feGaussianBlur result="dispersion-smoothness" stdDeviation="4"></feGaussianBlur>

    <feColorMatrix result="mask-normalized" in="SourceMask" values="
            0 0 0 0 0.5 
            0 0 0 0 0.5 
            0 0 0 0 0.5 
            0 0 0 1 0.0"></feColorMatrix>
    <feComposite result="balls-masked" in="dispersion-smoothness" in2="mask-normalized" operator="atop"></feComposite>
    <feFlood result="flood-0" flood-color="#808000"></feFlood>
    <feComposite result="NormalMapFull" in="balls-masked" in2="flood-0" operator="over"></feComposite>
    <!-- #endregion -->

    <!-- #region Compositing -->
    <feDisplacementMap result="displacement" in="SourceBackground" in2="NormalMapFull" scale="150" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>

    <!-- Background blur -->
    <feGaussianBlur result="blur-out" stdDeviation="1"></feGaussianBlur>
    <!-- <feColorMatrix
          result="BG-dim"
          values="
            0.7 0.0 0.0 0 0
            0.0 0.7 0.0 0 0 
            0.0 0.0 0.7 0 0 
            0.0 0.0 0.0 1 0"
        /> -->

    <!-- Contrast -->
    <feComponentTransfer>
      <feFuncR type="linear" slope=".9" intercept="0.05"></feFuncR>
      <feFuncG type="linear" slope=".9" intercept="0.05"></feFuncG>
      <feFuncB type="linear" slope=".9" intercept="0.05"></feFuncB>
    </feComponentTransfer>

    <feComposite result="balls-final" in2="SourceMask" operator="in"></feComposite>
    <!-- #endregion -->

    <!-- #region Fresnel-ish -->
    <feMorphology in="SourceMask" result="stroke-width" radius="1.8"></feMorphology>
    <feGaussianBlur result="outline-smoothness" stdDeviation="1"></feGaussianBlur>
    <feComposite result="bg-stroke-raw" in="balls-final" operator="out"></feComposite>
    <feColorMatrix result="bg-stroke" values="
            2 0 0 0 0 
            0 2 0 0 0 
            0 0 2 0 0 
            0 0 0 0.3 0"></feColorMatrix>

    <!-- Composite outline with balls -->
    <!-- in="bg-stroke" -->
    <feComposite result="outlined-balls" in2="balls-final" operator="over"></feComposite>

    <!-- #endregion -->

    <feDropShadow dx="1" dy="1" stdDeviation="5" flood-opacity=".3"></feDropShadow>
    <!-- compositing with bg -->
    <!-- <feComposite in2="SourceBackground"/> -->
  </filter>

  <filter
    id="liquid-glass-new"
    x="-20%"
    y="-20%"
    width="140%"
    height="140%"
  >
  <!-- 
  | Unpacking Sources
  -->

    <!-- Unpack Upper channel - Background  (XXXX XXX0) -->
    <feComponentTransfer result="SourceBackground" in="SourceGraphic">
      <feFuncR
        type="discrete"
        tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"
      />
      <feFuncG
        type="discrete"
        tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"
      />
      <feFuncB
        type="discrete"
        tableValues="0.000 0.008 0.016 0.024 0.031 0.039 0.047 0.055 0.063 0.071 0.079 0.087 0.094 0.102 0.110 0.118 0.126 0.134 0.142 0.150 0.157 0.165 0.173 0.181 0.189 0.197 0.205 0.213 0.220 0.228 0.236 0.244 0.252 0.260 0.268 0.276 0.283 0.291 0.299 0.307 0.315 0.323 0.331 0.339 0.346 0.354 0.362 0.370 0.378 0.386 0.394 0.402 0.409 0.417 0.425 0.433 0.441 0.449 0.457 0.465 0.472 0.480 0.488 0.496 0.504 0.512 0.520 0.528 0.535 0.543 0.551 0.559 0.567 0.575 0.583 0.591 0.598 0.606 0.614 0.622 0.630 0.638 0.646 0.654 0.661 0.669 0.677 0.685 0.693 0.701 0.709 0.717 0.724 0.732 0.740 0.748 0.756 0.764 0.772 0.780 0.787 0.795 0.803 0.811 0.819 0.827 0.835 0.843 0.850 0.858 0.866 0.874 0.882 0.890 0.898 0.906 0.913 0.921 0.929 0.937 0.945 0.953 0.961 0.969 0.976 0.984 0.992 1.000"
      />
    </feComponentTransfer>

    <!-- Unpack Lower channel - Mask (0000 000X) -->
    <feComponentTransfer in="SourceGraphic">
      <feFuncR
        type="discrete"
        tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"
      ></feFuncR>
      <feFuncG
        type="discrete"
        tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"
      ></feFuncG>
      <feFuncB
        type="discrete"
        tableValues="0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000 0.000 1.000"
      ></feFuncB>
    </feComponentTransfer>
    <!-- remove black -->
    <feColorMatrix type="luminanceToAlpha" />
    <!-- FXAAAAAA -->
    <feGaussianBlur stdDeviation="1" />
    <!-- alpha minus + sharpen -->
    <feColorMatrix
      values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0 
        0 0 0 2 0"
    />
    <feComposite result="SourceMask" />

  <!-- 
  | Lighting 
  -->

    <!-- Black -->
    <feDiffuseLighting
      in="SourceMask"
      diffuseConstant="1"
      surfaceScale="100"
    >
      <feDistantLight azimuth="225" elevation="180" />
    </feDiffuseLighting>
    <feColorMatrix
      type="luminanceToAlpha"
    />
    <feColorMatrix
      result="side-black"
      values="
        0 0 0 0.0 0 
        0 0 0 0.0 0 
        0 0 0 0.0 0 
        0 0 0 0.9 0"
    />

    <!-- Yellow -->
    <feDiffuseLighting
      in="SourceMask"
      diffuseConstant="0.52"
      surfaceScale="100"
    >
      <feDistantLight azimuth="45" elevation="180" />
    </feDiffuseLighting>
    <feColorMatrix
      type="luminanceToAlpha"
    />
    <feColorMatrix
      result="side-yellow"
      values="
        0 0 0 0 1
        0 0 0 0 1 
        0 0 0 0 0 
        0 0 0 1 0"
    />

    <!-- Red -->
    <feDiffuseLighting
      in="SourceMask"
      diffuseConstant="1"
      surfaceScale="100"
    >
      <feDistantLight azimuth="315" elevation="180" />
    </feDiffuseLighting>
    <feColorMatrix
      type="luminanceToAlpha"
    />
    <feColorMatrix
      result="side-red"
      values="
        0 0 0 0 1 
        0 0 0 0 0 
        0 0 0 0 0 
        0 0 0 1 0"
    />

    <!-- Green -->
    <feDiffuseLighting
      result="diffuse-lighting-0"
      in="SourceMask"
      diffuseConstant="1"
      surfaceScale="100"
      style=""
    >
      <feDistantLight azimuth="135" elevation="180" />
    </feDiffuseLighting>
    <feColorMatrix
      result="color-matrix-0"
      in="diffuse-lighting-0"
      type="luminanceToAlpha"
    />
    <feColorMatrix
      result="side-green"
      in="color-matrix-0"
      values="
        0 0 0 0 0 
        0 0 0 0 1 
        0 0 0 0 0 
        0 0 0 1 0"
    />
    <!-- Green -->

  <!-- 
  | Normal Map Creation 
  -->

    <!-- Combining sides -->
    <feBlend
      in="side-green"
      mode="screen"
    />
    <feBlend
      in="side-red"
      mode="screen"
    />
    <feBlend
      in="side-yellow"
      mode="screen"
    />
    <feBlend
      in="side-black"
      mode="multiply"
    />

    <!-- Refraction Controls -->
    <feMorphology
      result="refraction-thickness"
      radius="5"
      operator="dilate"
    />
    <feGaussianBlur
      result="refraction-smoothness"
      in="refraction-thickness"
      stdDeviation="5"
    />
    
    <feComposite
      result="balls-map"
      in2="SourceMask"
      operator="in"
    />
    <feFlood result="normal-bg-color" flood-color="#808000" />
    <feComposite
      result="NormalMapFull"
      in="balls-map"
      in2="normal-bg-color"
      operator="over"
    />

  <!-- 
  | Compositing 
  -->
    <feDisplacementMap
      result="displacement"
      in="SourceBackground"
      in2="NormalMapFull"
      scale="100"
      xChannelSelector="R"
      yChannelSelector="G"
    />

    <!-- Background blur -->
    <feGaussianBlur
      result="blur-out"
      stdDeviation="1"
      in="displacement"
    />
    <feColorMatrix
      in="blur-out"
      values="
        1 0 0 0 0 
        0 1 0 0 0 
        0 0 1 0 0 
        0 0 0 1 0"
    />
    <!-- Contrast 0.9 -->
    <feComponentTransfer result="backdrop-processed">
      <feFuncR type="linear" slope=".9" intercept="0.05"></feFuncR>
      <feFuncG type="linear" slope=".9" intercept="0.05"></feFuncG>
      <feFuncB type="linear" slope=".9" intercept="0.05"></feFuncB>
    </feComponentTransfer>
    <feComposite
      result="balls-final"
      in2="SourceMask"
      operator="in"
    />
    <!-- #endregion Compositing -->
  </filter>
  
  <!-- Fresnel-ish -->
  <filter id="fresnel">
    <feMorphology
      in="SourceMask"
      result="stroke-width"
      radius="3"
    />
    <feGaussianBlur
      result="outline-smoothness"
      stdDeviation="2"
    />
    <feComposite
      result="bg-stroke-raw"
      in="SourceGraphic"
      operator="out"
      in2="outline-smoothness"
    />
    <feColorMatrix
      result="bg-stroke"
      values="
        2 0 0 0 0.1 
        0 2 0 0 0.1 
        0 0 2 0 0.1 
        0 0 0 0.69 0"
    />
    <!-- fe blend -->
    <feBlend
      result="outlined-balls"
      in="SourceGraphic"
      mode="overlay" />
  </filter>

</svg>
    `;
    window.parent.document.body.appendChild(svgContainer);
}

  createWindow({ title, icon, content, x, y, width, height }) {
    const id = this.windowIdCounter++;

    const windowEl = window.parent.document.createElement('div');
    windowEl.className = 'window';
    windowEl.style.width = `${width}px`;
    windowEl.style.height = `${height}px`;
    windowEl.style.left = `${x}px`;
    windowEl.style.top = `${y}px`;

    const header = window.parent.document.createElement('div');
    header.className = 'window-header';

        function updateAccent() {
          header.style.backgroundColor = window.getAccent("rgba(50, 50, 50, 0.9)");
          requestAnimationFrame(updateAccent);
        }
        updateAccent();

    const titleEl = window.parent.document.createElement('div');
    titleEl.className = 'window-title';
    const titleIcon = window.parent.document.createElement('img');
    titleIcon.className = 'window-icon';
    titleIcon.src = icon;
    if (icon) {
      titleEl.appendChild(titleIcon);
    }
    const titleText = window.parent.document.createElement('span');
    titleText.textContent = title;
    titleEl.appendChild(titleText);

    const controls = window.parent.document.createElement('div');
    controls.className = 'window-controls';

    const shadeBtn = this.createWindowButton(`➕`);
    const minimizeBtn = this.createWindowButton('➖');
    const maximizeBtn = this.createWindowButton(`➕`);
    const closeBtn = this.createWindowButton(`❌`)

    const shadeBtn2 = this.createWindowIcon(`./icons/controls/shade_up.svg`);
    const minimizeBtn2 = this.createWindowIcon('./icons/controls/minus.svg');
    const maximizeBtn2 = this.createWindowIcon(`./icons/controls/maximize-1.svg`);
    const closeBtn2 = this.createWindowIcon(`./icons/controls/x.svg`)

    controls.append(minimizeBtn2, maximizeBtn2);
    header.append(closeBtn2, titleEl, controls);

    const contentEl = window.parent.document.createElement('div');
    contentEl.className = 'window-content';
    contentEl.innerHTML = content;

    windowEl.append(header);
    window.parent.document.getElementById('windows').appendChild(windowEl);
        // Add the liquid glass effect
        const liqGLdiv = window.parent.document.createElement('div');
        liqGLdiv.className = "liquidGL"
        windowEl.appendChild(liqGLdiv);
        const liqGLContent = window.parent.document.createElement('div');
        liqGLContent.className = "content" 
            liqGLContent.appendChild(contentEl);
        liqGLdiv.appendChild(liqGLContent);   

    const taskButton = window.parent.document.createElement('button');
    taskButton.className = 'task-button';
    taskButton.textContent = title;
    this.taskList.appendChild(taskButton);

    // Store window data
    const windowData = {
      element: windowEl,
      taskButton,
      title,
      isMinimized: false
    };

    this.windows.set(id, windowData);

    this.setupWindowEvents(id, windowEl, header);
    this.setupTaskButtonEvents(id, taskButton);
    this.setupWindowControls(id, closeBtn2, maximizeBtn2, minimizeBtn2, shadeBtn2);

    this.activateWindow(id);

    return id;
  }

  setupWindowEvents(id, windowEl, header) {
    let mouseDown = false;
    let clickDifferenceX = 0;
    let clickDifferenceY = 0;

    const iframe = windowEl.querySelector('iframe');

    windowEl.addEventListener('mousedown', () => this.activateWindow(id));

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return; // Only handle left-clicks
      mouseDown = true;
      e.preventDefault();

      if (iframe) iframe.style.pointerEvents = 'none';

      const rect = windowEl.getBoundingClientRect();
      clickDifferenceX = e.clientX - rect.left;
      clickDifferenceY = e.clientY - rect.top;
    });

    header.addEventListener('dblclick', () => this.maximizeWindow(id));


    window.parent.document.addEventListener('mousemove', (e) => {
      if (!mouseDown) return;
      e.preventDefault();
      windowEl.style.left = `${e.clientX - clickDifferenceX}px`;
      windowEl.style.top = `${e.clientY - clickDifferenceY}px`;
    });

    window.parent.document.addEventListener('mouseup', () => {
      if (!mouseDown) return;
      mouseDown = false;

      if (iframe) iframe.style.pointerEvents = 'auto';
    });
  }

  setupTaskButtonEvents(id, taskButton) {
    taskButton.addEventListener('click', () => {
      const win = this.windows.get(id);
      if (win.isMinimized) {
        this.restoreWindow(id);
      } else if (this.activeWindow === id) {
        this.minimizeWindow(id);
      } else {
        this.activateWindow(id);
      }
    });
  }

  setupWindowControls(id, Btn1, Btn2, Btn3, Btn4) {
    Btn2.addEventListener('click', () => this.maximizeWindow(id));
    Btn3.addEventListener('click', () => this.minimizeWindow(id));
    Btn1.addEventListener('click', () => this.closeWindow(id));
    Btn4.addEventListener('click', () => this.shadeWindow(id));
  }

  createWindowButton(text) {
    const button = window.parent.document.createElement('button');
    button.className = 'window-button';
    button.textContent = text;
    return button;
  }
  createWindowIcon(text) {
    const button = window.parent.document.createElement('button');
    button.className = 'window-button';
    const image = window.parent.document.createElement('img');
    image.className = 'window-icon';
    image.src = text;
    button.appendChild(image);
    return button;
  }


  activateWindow(id) {
    this.windows.forEach((win, winId) => {
      if (winId === id) {
        win.element.style.zIndex = '100';
        win.taskButton.classList.add('active');
      } else {
        win.element.style.zIndex = '1';
        win.taskButton.classList.remove('active');
      }
    });
    this.activeWindow = id;
    
  }

  minimizeWindow(id) {
    const win = this.windows.get(id);
    win.element.style.display = 'none';
    win.isMinimized = true;
    win.taskButton.classList.remove('active');
  }

shadeWindow(id) {
  const win = this.windows.get(id);
  const windowEl = win.element;

  if (!windowEl.dataset.originalHeight) {
    windowEl.dataset.originalHeight = windowEl.offsetHeight + 'px';
  }

  const isShaded = windowEl.classList.contains('shaded');

  const windowIcons = windowEl.querySelectorAll('img.window-icon');
  if (windowIcons.length <= 2) return;
  const shadeImg = windowIcons[2];

  if (isShaded) {
    windowEl.style.height = windowEl.dataset.originalHeight;
    windowEl.classList.remove('shaded');
    shadeImg.src = './icons/controls/shade_up.svg';
  } else {
    windowEl.style.height = '32px';
    windowEl.classList.add('shaded');
    shadeImg.src = './icons/controls/shade_down.svg';
  }
}

  restoreWindow(id) {
    const win = this.windows.get(id);
    win.element.style.display = 'flex';
    win.isMinimized = false;
    this.activateWindow(id);
  }

  maximizeWindow(id) {
    const win = this.windows.get(id);
    const isMaximized = win.element.style.width === '100vw';

    if (isMaximized) {
      win.element.style.width = win.prevWidth || '400px';
      win.element.style.height = win.prevHeight || '300px';
      win.element.style.left = win.prevLeft || '0px';
      win.element.style.top = win.prevTop || '0px';
    } else {
      win.prevWidth = win.element.style.width;
      win.prevHeight = win.element.style.height;
      win.prevLeft = win.element.style.left;
      win.prevTop = win.element.style.top;

      win.element.style.width = '100vw';
      win.element.style.height = `calc(100vh - var(--taskbar-height))`;
      win.element.style.left = '0';
      win.element.style.top = '0';
    }
  }

  closeWindow(id) {
    const win = this.windows.get(id);
    //append closing to class
    win.element.classList.add('closing');
    setTimeout(() => {
      win.element.remove();
      win.taskButton.remove();
      this.windows.delete(id);
    }, 300);
  }
}