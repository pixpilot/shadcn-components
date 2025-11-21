import type { SpinnerProps } from './spinner';

interface Options extends SpinnerProps {
  uniqueId: string;
}

export function getGlobalStyles(options: Options): string {
  const { uniqueId, speed = 2, size, colors, color } = options;

  const getColorAnimationId = () => {
    if (!colors || colors.length === 0) return '';
    return `${uniqueId}-color-change`;
  };

  return `
      @keyframes ${uniqueId}-rotate {
        100% {
          transform: rotate(360deg);
        }
      }

      @keyframes ${uniqueId}-dash {
        0% {
          stroke-dasharray: 1, 200;
          stroke-dashoffset: 0;
        }
        50% {
          stroke-dasharray: 89, 200;
          stroke-dashoffset: -35;
        }
        100% {
          stroke-dasharray: 89, 200;
          stroke-dashoffset: -124;
        }
      }

      .${uniqueId}-loader {
        position: relative;
        display: inline-block;
        width: ${size}px;
        height: ${size}px;
        overflow: hidden;
      }

      .${uniqueId}-circular {
        animation: ${uniqueId}-rotate ${speed}s linear infinite;
        height: 100%;
        width: 100%;
        max-height: 100%;
        max-width: 100%;
      }

      .${uniqueId}-path {
        stroke: ${colors && colors.length > 0 ? colors[0] : color};
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
        animation: ${
          colors && colors.length > 0
            ? `${uniqueId}-dash 1.5s ease-in-out infinite, ${getColorAnimationId()} ${speed * colors.length}s ease-in-out infinite`
            : `${uniqueId}-dash 1.5s ease-in-out infinite`
        };
        stroke-linecap: round;
      }
    `;
}
