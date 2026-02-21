import { Placement } from "@popperjs/core";
import React, { FC, forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import { usePopper } from "react-popper";
import useClient from "../../hooks/useClient";
import useDelayEvent from "../../hooks/useDelayEvent";
import useOutsideClick from "../../hooks/useOutsideClick";
export interface PopoverProps {
  label: string | React.ReactNode;
  content: React.ReactNode;
  trigger?: "click";
  y?: number;
  x?: number;
  placement?: Placement;
  flipPlacement?: Placement[];
  afterClose?: () => void;
  contentClassName?: string;
  className?: string;
  onVisibleChange?: (visible: boolean) => void;
}

export interface PopoverRefProps {
  close: () => void;
}

const Popover = forwardRef<PopoverRefProps, PopoverProps>((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      close: hide
    };
  });

  const {
    label,
    content,
    trigger,
    y,
    x,
    placement = "bottom-start",
    flipPlacement,
    afterClose,
    contentClassName,
    className,
    onVisibleChange
  } = props;

  const isEnabled = useMemo(() => {
    return trigger === "click" ? false : true;
  }, [trigger]);

  const [showPopover, setShowPopover] = useDelayEvent<boolean>(false, 100, isEnabled);

  const popoverRef = useRef<HTMLDivElement | null>(null);

  const popoverElement = useRef<HTMLDivElement | null>(null);

  useOutsideClick(
    showPopover,
    setShowPopover,
    isEnabled,
    popoverRef.current,
    popoverElement.current
  );

  const { isClient } = useClient();

  const { styles, attributes, update } = usePopper(popoverRef.current, popoverElement.current, {
    placement: placement,
    strategy: "fixed",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [x, y]
        }
      },
      {
        name: "flip",
        options: {
          fallbackPlacements: flipPlacement ? flipPlacement : []
        }
      }
    ]
  });

  const hide = () => {
    setShowPopover(false);
  };

  useEffect(() => {
    if (update) {
      update();
    }
  }, [showPopover, update]);

  const togglePopover = () => {
    if (trigger === "click") {
      setShowPopover(!showPopover);
    }
  };

  const handleMouseEnter = () => {
    if (trigger !== "click") {
      setShowPopover(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger !== "click") {
      setShowPopover(false);
    }
  };

  useEffect(() => {
    if (!showPopover) {
      afterClose && afterClose();
    }
    onVisibleChange?.(showPopover);
  }, [showPopover]);

  return (
    <div ref={popoverRef} onClick={togglePopover} className={className}>
      <label
        className="bu-cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}>
        {label}
      </label>
      {isClient &&
        createPortal(
          <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={popoverElement}
            style={styles.popper}
            {...attributes.popper}
            className={`bu-z-[9999] bu-shadow bu-rounded-[4px] bu-transition-[opacity,visibility] bu-duration-[120ms] bu-ease-in-out ${
              showPopover
                ? "bu-visible bu-pointer-events-auto bu-opacity-[1]"
                : "bu-invisible bu-pointer-events-none bu-opacity-0"
            } ${contentClassName}`}>
            {content}
          </div>,
          document.body
        )}
    </div>
  );
});

export { Popover };
