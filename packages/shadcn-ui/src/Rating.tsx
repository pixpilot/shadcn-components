import type {
  RatingButtonProps as BaseRatingButtonProps,
  RatingProps as BaseRatingProps,
} from '@pixpilot/shadcn';
import { Rating as BaseRating, RatingButton as BaseRatingButton } from '@pixpilot/shadcn';

export interface RatingProps extends Omit<BaseRatingProps, 'children'> {
  /**
   * Color variant for the rating
   * @default 'default'
   */
  color?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'destructive'
    | 'foreground'
    | 'accent'
    | 'muted'
    | 'ring';
}
export interface RatingButtonProps extends BaseRatingButtonProps {}

const DEFAULT_MAX_RATING = 5;

const colorClasses = {
  default:
    '[&_svg]:!fill-yellow-400 [&_svg]:!text-yellow-400 dark:[&_svg]:!fill-yellow-500 dark:[&_svg]:!text-yellow-500 [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  primary:
    '[&_svg]:!fill-primary [&_svg]:!text-primary [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  secondary:
    '[&_svg]:!fill-secondary [&_svg]:!text-secondary-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  destructive:
    '[&_svg]:!fill-destructive [&_svg]:!text-destructive [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  foreground:
    '[&_svg]:!fill-foreground [&_svg]:!text-foreground [&_svg.fill-transparent]:!fill-transparent',
  accent:
    '[&_svg]:!fill-accent [&_svg]:!text-accent-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  muted:
    '[&_svg]:!fill-muted [&_svg]:!text-muted-foreground [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
  ring: '[&_svg]:!fill-ring [&_svg]:!text-ring [&_svg.fill-transparent]:!fill-transparent [&_svg.fill-transparent]:!text-foreground',
};

/**
 * Rating component wrapper with enhanced functionality
 */
function Rating({ max = DEFAULT_MAX_RATING, color = 'default', ...props }: RatingProps) {
  const colorClass = colorClasses[color];

  return (
    <BaseRating max={max} {...props}>
      {Array.from({ length: max }, (_, i) => (
        <BaseRatingButton key={i + 1} index={i + 1} className={colorClass} />
      ))}
    </BaseRating>
  );
}

/**
 * Individual rating button component
 */
const RatingButton = BaseRatingButton;

export { Rating, RatingButton };
