import {
  FC,
  ReactNode,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import styles from "./index.module.scss";
import ReactDOM from "react-dom";
import { TextField, useTheme } from "../..";
import useAlign from "../../hooks/useAlign";
import {
  activeStyles,
  bgStyles,
  disabledStyles,
  iconStyles,
  iconStylesVariants,
  itemStyles,
  searchIconStyles,
  searchStyles
} from "./styles";
import SelectArrow from "../../assets/icons/text-arrow.svg";
import SearchIcon from "../../assets/icons/search.svg";
import { CustomFields } from "../../types/component";

interface Options extends CustomFields {
  label: string;
  value: string;
}

interface TextSelectProps {
  id?: string;
  options: Options[];
  onChange: (value: string) => void;
  inputChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  disabled?: string;
  className?: string;
  inputClassName?: string;
  valueClassName?: string;
  hideEndAdornment?: boolean;
  readOnly?: boolean;
  scrollContainer?: HTMLDivElement | null;
  children?: JSX.Element | ReactNode;
  auto?: boolean;
  search?: boolean;
  searchChange?: (value: string) => void;
  searchClassName?: string;
  startAdornment?: ReactNode;
  customSelectItems?: (item: Options) => ReactNode;
  selectItemClassName?: string;
  hideSelectedState?: boolean;
  offsetPixels?: number;
  preventDuplicateSelection?: boolean;
  inputDisabled?: boolean;
  base?: "input" | "div";
  customLabel?: (item: Options) => ReactNode;
}

type OptionsProps = Omit<TextSelectProps, "placeholder"> & {
  className?: string;
  parent: HTMLDivElement | null;
  hide: () => void;
};

const Options = forwardRef<HTMLDivElement, OptionsProps>(
  (
    {
      parent,
      options,
      onChange,
      className,
      disabled,
      defaultValue,
      scrollContainer,
      children,
      hide,
      auto = true,
      search = false,
      searchChange,
      customSelectItems,
      selectItemClassName,
      searchClassName,
      hideSelectedState = false,
      offsetPixels = -2,
      preventDuplicateSelection = true
    },
    ref
  ) => {
    const { theme } = useTheme();

    const targetRef = useRef<HTMLDivElement | null>(null);

    const [optionHeight, setOptionHeight] = useState(0);

    const { offset, resize } = useAlign(parent);

    const { offsetX, offsetY } = offset;

    const [isBottomed, setIsBottomed] = useState(false);

    const { height, width } = parent ? parent.getBoundingClientRect() : { width: 0, height: 0 };

    const handleClick = (value: string, e: React.MouseEvent) => {
      e.preventDefault();
      if (disabled === value) {
        return;
      }

      if (value !== defaultValue || !preventDuplicateSelection) {
        onChange(value);
      }

      hide();
    };

    const handleSearch = (value: string) => {
      searchChange && searchChange(value);
    };

    useEffect(() => {
      if (scrollContainer) {
        scrollContainer.addEventListener("scroll", resize);
      }
      return () => {
        if (scrollContainer) {
          scrollContainer.removeEventListener("scroll", resize);
        }
      };
    }, [scrollContainer]);

    useEffect(() => {
      if (auto) {
        setTimeout(() => {
          if (targetRef.current) {
            const screenHeight = window.innerHeight || document.documentElement.clientHeight;
            const { bottom, height } = targetRef.current.getBoundingClientRect();
            setOptionHeight(height);
            if (bottom > screenHeight) {
              setIsBottomed(true);
            } else {
              setIsBottomed(false);
            }
          }
        }, 0);
      }
    }, [auto]);

    return offsetX !== 0 && offsetY !== 0
      ? ReactDOM.createPortal(
          <div
            className={`${styles.options} ${className} ${bgStyles({ theme })}`}
            style={{
              top: isBottomed ? offsetY - optionHeight - 4 : offsetY + height + 4 + "px",
              left: offsetX + "px"
            }}
            ref={targetRef}>
            <div ref={ref} style={{ width: width + offsetPixels + "px" }}>
              {search && (
                <div className={`${searchStyles({ theme })} ${searchClassName}`}>
                  <TextField
                    variant="filled"
                    startAdornment={<SearchIcon className={searchIconStyles({ theme })} />}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
              )}

              {options.map((item) => {
                return (
                  <div
                    onClick={(e) => handleClick(item.value, e)}
                    className={`${styles.item} ${
                      disabled === item.value ? disabledStyles({ theme }) : itemStyles({ theme })
                    } ${
                      hideSelectedState
                        ? ""
                        : defaultValue === item.value
                        ? activeStyles({ theme })
                        : ""
                    } ${selectItemClassName}`}
                    style={{ width: width + offsetPixels + "px" }}
                    key={item.value}>
                    {customSelectItems ? customSelectItems(item) : item.label}
                  </div>
                );
              })}
              <div className="bu-cursor-pointer bu-px-[16px]">{children}</div>
            </div>
          </div>,
          document.body
        )
      : null;
  }
);
export interface TextSelectRefProps {
  close: () => void;
}

const TextSelect = forwardRef<TextSelectRefProps, TextSelectProps>((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      close: hide
    };
  });

  const {
    id,
    placeholder,
    defaultValue,
    options,
    onChange,
    inputChange,
    onFocus,
    onBlur,
    disabled,
    className = "",
    inputClassName = "",
    valueClassName = "",
    hideEndAdornment = false,
    readOnly = true,
    value,
    scrollContainer,
    children,
    auto = true,
    search = false,
    searchChange,
    searchClassName,
    startAdornment,
    customSelectItems,
    selectItemClassName,
    hideSelectedState,
    offsetPixels = -2,
    preventDuplicateSelection = true,
    inputDisabled = false,
    base = "input",
    customLabel
  } = props;

  const targetRef = useRef<HTMLDivElement | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const divRef = useRef<HTMLDivElement>(null);

  const customeRef = useRef<HTMLDivElement | null>(null);

  const searchRef = useRef<HTMLDivElement | null>(null);

  const [isFocus, setIsFocus] = useState(false);

  const [show, setShow] = useState(false);

  const { theme } = useTheme();

  const label = useMemo(() => {
    const option = options.find((item) => {
      return item.value === defaultValue;
    });
    return option ? option.label : "";
  }, [defaultValue]);

  const customLabelNode = useMemo(() => {
    const option = options.find((item) => {
      return item.value === defaultValue;
    });
    return option ? (customLabel ? customLabel(option) : option.label) : "";
  }, [defaultValue, customLabel]);

  const hide = () => {
    setShow(false);
    setIsFocus(false);
    searchChange && searchChange("");
  };

  const handleClickOutside = (event: any) => {
    if (customeRef.current?.contains(event.target)) {
      return;
    }

    if (
      (inputRef.current && !inputRef.current.contains(event.target)) ||
      (divRef.current && !divRef.current.contains(event.target))
    ) {
      hide();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      document.addEventListener("click", handleClickOutside);
      inputRef.current.addEventListener("focus", () => {
        setShow(true);
        setIsFocus(true);
      });
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="bu-relative bu-cursor-pointer" ref={targetRef}>
      <TextField
        id={id || ""}
        disabled={inputDisabled}
        ref={inputRef}
        inputClassName={`${styles.input} ${valueClassName} ${base === "div" ? "bu-h-0" : ""}`}
        variant="outlined"
        onFocus={() => {
          setShow(true);
          onFocus && onFocus();
        }}
        className={inputClassName}
        readOnly={readOnly}
        onBlur={() => {
          onBlur && onBlur();
        }}
        placeholder={placeholder}
        value={readOnly === false ? value : label}
        onChange={(e) => {
          inputChange && inputChange(e.target.value);
        }}
        startAdornment={startAdornment}
        endAdornment={
          !hideEndAdornment &&
          base === "input" && (
            <SelectArrow
              onClick={() => {
                if (inputDisabled) return;
                setTimeout(() => {
                  !isFocus ? inputRef.current?.focus() : inputRef.current?.blur();
                }, 0);
              }}
              className={`${iconStylesVariants({ theme, disabled: inputDisabled })} ${
                isFocus ? styles.roate : ""
              }`}
            />
          )
        }
        autoComplete="off"
      />
      <div
        ref={divRef}
        className={`${styles.input} ${valueClassName} ${
          base === "div" ? "bu-absolute bu-left-0 bu-top-0" : ""
        } bu-flex bu-h-full bu-w-full bu-items-center bu-justify-between`}
        onClick={() => {
          if (inputDisabled) return;
          setTimeout(() => {
            !isFocus ? inputRef.current?.focus() : inputRef.current?.blur();
          }, 0);
        }}>
        <div className="bu-pl-[16px] bu-text-[12px]">{customLabelNode}</div>
        {!hideEndAdornment && (
          <SelectArrow
            onClick={() => {
              if (inputDisabled) return;
              setTimeout(() => {
                !isFocus ? inputRef.current?.focus() : inputRef.current?.blur();
              }, 0);
            }}
            className={`${iconStylesVariants({ theme, disabled: inputDisabled })} ${
              isFocus ? styles.roate : ""
            }`}
          />
        )}
      </div>

      {show && (
        <Options
          ref={customeRef}
          parent={targetRef.current}
          options={options}
          onChange={onChange}
          disabled={disabled}
          defaultValue={defaultValue}
          className={className}
          scrollContainer={scrollContainer}
          customSelectItems={customSelectItems}
          selectItemClassName={selectItemClassName}
          hideSelectedState={hideSelectedState}
          offsetPixels={offsetPixels}
          hide={hide}
          auto={auto}
          search={search}
          searchChange={searchChange}
          searchClassName={searchClassName}
          preventDuplicateSelection={preventDuplicateSelection}>
          {children}
        </Options>
      )}
    </div>
  );
});

export { TextSelect };
