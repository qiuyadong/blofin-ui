import { Meta } from "@storybook/react";
import { useEffect, useState } from "react";
import { ThemeProvider } from "../provider/ThemeProvider";
import { NoticeProvider } from "../provider/NoticeProvider";
import { Button } from "../components/Button/Button";
import { TextField } from "../components/TextField";
import { Select } from "../components/Select";
import { Badge } from "../components/Badge/Badge";
import { Alert } from "../components/Alert";
import { Checkbox } from "../components/Checkbox";
import { RadioButton } from "../components/RadioButton";
import { Switch } from "../components/Switch/Switch";
import { Tab } from "../components/Tab/Tab";
import { Pagination } from "../components/Pagination/Pagination";
import { Slider } from "../components/Slider";
import { Tooltip } from "../components/Tooltip/Tooltip";
import { Typography } from "../components/Typography/Typography";
import { Divider } from "../components/Divider";
import TextArea from "../components/Textarea";
import DatePickerRange, { DateValue } from "../components/DatePickerRange/DatePickerRange";
import DateTimePicker from "../components/DateTimePicker/DateTimePicker";
import addDays from "date-fns/addDays";
import useMode from "../hooks/useMode";

const meta: Meta = {
  title: "Test/完整的 RTL 组件测试",
  parameters: {
    docs: {
      description: {
        component: "全面测试所有组件的 RTL 支持"
      }
    }
  }
};

export default meta;

// RTL 包装器：同时设置 DOM 和 Context（postcss-rtl 需要 DOM 属性）
const RTLTestWrapper = ({
  direction,
  children
}: {
  direction: "ltr" | "rtl";
  children: React.ReactNode;
}) => {
  useEffect(() => {
    // ✅ 总是设置 dir 属性（即使是 ltr），确保 Tailwind 变体正常工作
    document.documentElement.setAttribute("dir", direction);
    return () => {
      // ✅ 清理时也明确设置为 ltr（不是删除）
      document.documentElement.setAttribute("dir", "ltr");
    };
  }, [direction]);

  return <>{children}</>;
};

export const CompleteTest = {
  render: () => {
    const mode = useMode();
    const [direction, setDirection] = useState<"ltr" | "rtl">("ltr");
    const [checkedItems, setCheckedItems] = useState({
      checkbox1: false,
      checkbox2: true
    });
    const [selectedRadio, setSelectedRadio] = useState("radio1");
    const [switchValue, setSwitchValue] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sliderValue, setSliderValue] = useState(50);

    // DatePickerRange 初始化（参考 DatePickerRange.stories.tsx）
    const initDateRange = () => {
      const from = addDays(new Date(), -7);
      const to = addDays(new Date(), -1);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      return {
        start_time: from.getTime(),
        end_time: to.getTime()
      };
    };
    const [dateRange, setDateRange] = useState<DateValue>(initDateRange());
    const [dateTime, setDateTime] = useState<number | undefined>(new Date().getTime());

    return (
      <ThemeProvider value={{ theme: mode, direction }}>
        <RTLTestWrapper direction={direction}>
          <NoticeProvider>
            <div style={{ padding: "20px", maxWidth: "1200px" }}>
              {/* 控制面板 */}
              <div
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 100,
                  padding: "15px",
                  marginBottom: "20px",
                  borderRadius: "8px",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(10px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}>
                <div
                  style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <Button
                    variant="primary"
                    size="medium"
                    onClick={() => setDirection((d) => (d === "ltr" ? "rtl" : "ltr"))}>
                    切换方向 (当前: {direction.toUpperCase()})
                  </Button>
                  <Badge color="info" label={`测试模式: ${direction}`} />
                  <Badge color="success" label="✓ 可交互测试" />
                </div>
              </div>

              {/* 1. 输入组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">1. 输入组件 (Input Components)</Typography>
                <Divider direction="horizontal" />
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                  }}>
                  <div>
                    <h4>TextField - 文本输入框</h4>
                    <TextField
                      variant="outlined"
                      placeholder="请输入文本 / Enter text..."
                      defaultValue="测试文本 Test"
                    />
                  </div>
                  <div>
                    <h4>TextArea - 文本域</h4>
                    <TextArea
                      placeholder="请输入多行文本... / Enter multiline text..."
                      defaultValue="多行文本测试&#10;Multiline text test"
                      row={3}
                    />
                  </div>
                  <div>
                    <h4>Select - 下拉选择</h4>
                    <Select
                      selectItems={[
                        { label: "选项 1 / Option 1", value: "1" },
                        { label: "选项 2 / Option 2", value: "2" },
                        { label: "选项 3 / Option 3", value: "3" }
                      ]}
                      placeholder="请选择 / Please select"
                    />
                  </div>
                  <div>
                    <h4>DatePickerRange - 日期范围选择器</h4>
                    <DatePickerRange
                      defaultValue={dateRange}
                      dateClassName="bu-w-auto"
                      setValues={setDateRange}
                      limitDays={370}
                      disabledDays={[
                        {
                          from: new Date(),
                          to: new Date("2100-12-31")
                        }
                      ]}
                      quickSelection={[
                        { label: "7 Days", value: 7 },
                        { label: "30 Days", value: 30 },
                        { label: "90 Days", value: 90 }
                      ]}
                      disabledSameDay
                      lang="en"
                      selectText="Selected"
                      confirmText="Confirm"
                      cancelText="Cancel"
                      toText="To"
                      auto={false}
                      includesToday={false}
                      mode="normal"
                      dateSuffix="(UTC+8)"
                      startPlaceholder="Start Date"
                      endPlaceholder="End Date"
                      isUtcTime
                      timeZone="Asia/Shanghai"
                    />
                  </div>
                  <div>
                    <h4>DateTimePicker - 日期时间选择器（带时间）</h4>
                    <div style={{ marginBottom: "10px", display: "inline-block" }}>
                      <DateTimePicker
                        defaultValue={dateTime}
                        setValues={setDateTime}
                        disabledDays={[
                          {
                            from: new Date("1900-01-01"),
                            to: addDays(new Date(), -1)
                          }
                        ]}
                        hidePast
                        lang="en"
                        cancelText="Cancel"
                        confirmText="Confirm"
                        submitText="OK"
                      />
                    </div>
                  </div>
                  <div>
                    <h4>DateTimePicker - 日期时间选择器（仅日期）</h4>
                    <div style={{ display: "inline-block" }}>
                      <DateTimePicker
                        defaultValue={dateTime}
                        setValues={setDateTime}
                        hidePast
                        lang="en"
                        cancelText="Cancel"
                        confirmText="Confirm"
                        submitText="OK"
                        hideHoursAndMinutes={true}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* 2. 按钮组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">2. 按钮组件 (Button Components)</Typography>
                <Divider direction="horizontal" />
                <div style={{ marginTop: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  <Button variant="primary" size="medium">
                    主要按钮
                  </Button>
                  <Button variant="secondary" size="medium">
                    次要按钮
                  </Button>
                  <Button variant="tertiary" size="medium">
                    第三按钮
                  </Button>
                  <Button variant="ghost" size="medium">
                    Ghost
                  </Button>
                  <Button variant="text" size="medium">
                    Text
                  </Button>
                  <Button variant="buy" size="medium">
                    买入 Buy
                  </Button>
                  <Button variant="sell" size="medium">
                    卖出 Sell
                  </Button>
                </div>
              </section>

              {/* 3. 选择组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">3. 选择组件 (Selection Components)</Typography>
                <Divider direction="horizontal" />
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                  <div>
                    <h4>Checkbox - 多选框</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Checkbox
                        checked={checkedItems.checkbox1}
                        onChange={(e) =>
                          setCheckedItems({ ...checkedItems, checkbox1: e.target.checked })
                        }
                        label="选项 1 / Option 1"
                      />
                      <Checkbox
                        checked={checkedItems.checkbox2}
                        onChange={(e) =>
                          setCheckedItems({ ...checkedItems, checkbox2: e.target.checked })
                        }
                        label="选项 2 (默认选中) / Option 2 (default checked)"
                      />
                    </div>
                  </div>

                  <div>
                    <h4>RadioButton - 单选框</h4>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <RadioButton
                        label="单选 1 / Radio 1"
                        name="radioGroup"
                        value="radio1"
                        selected={selectedRadio}
                        onChange={(e) => setSelectedRadio(e.target.value)}
                      />
                      <RadioButton
                        label="单选 2 / Radio 2"
                        name="radioGroup"
                        value="radio2"
                        selected={selectedRadio}
                        onChange={(e) => setSelectedRadio(e.target.value)}
                      />
                      <RadioButton
                        label="单选 3 / Radio 3"
                        name="radioGroup"
                        value="radio3"
                        selected={selectedRadio}
                        onChange={(e) => setSelectedRadio(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <h4>Switch - 开关</h4>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <Switch check={switchValue} onChange={() => setSwitchValue(!switchValue)} />
                      <span>状态 Status: {switchValue ? "开启 ON" : "关闭 OFF"}</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. 展示组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">4. 展示组件 (Display Components)</Typography>
                <Divider direction="horizontal" />
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                  <div>
                    <h4>Badge - 徽章</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <Badge color="primary" label="Primary" />
                      <Badge color="secondary" label="Secondary" />
                      <Badge color="success" label="Success ✓" />
                      <Badge color="warning" label="Warning ⚠" />
                      <Badge color="danger" label="Danger ✕" />
                      <Badge color="info" label="Info ℹ" />
                    </div>
                  </div>

                  <div>
                    <h4>Alert - 警告提示</h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <Alert type="success" content="✓ 成功提示信息 Success message" />
                      <Alert type="warning" content="⚠ 警告提示信息 Warning message" />
                      <Alert type="danger" content="✕ 错误提示信息 Error message" />
                    </div>
                  </div>

                  <div>
                    <h4>Tooltip - 工具提示 (悬停查看)</h4>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <Tooltip content="顶部提示 Top tooltip" placement="top">
                        <Button variant="secondary" size="small">
                          Top 顶部
                        </Button>
                      </Tooltip>
                      <Tooltip content="底部提示 Bottom tooltip" placement="bottom">
                        <Button variant="secondary" size="small">
                          Bottom 底部
                        </Button>
                      </Tooltip>
                      <Tooltip content="左侧提示 Left tooltip" placement="left">
                        <Button variant="secondary" size="small">
                          Left 左侧
                        </Button>
                      </Tooltip>
                      <Tooltip content="右侧提示 Right tooltip" placement="right">
                        <Button variant="secondary" size="small">
                          Right 右侧
                        </Button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. 导航组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">5. 导航组件 (Navigation Components)</Typography>
                <Divider direction="horizontal" />
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                  <div>
                    <h4>Tab - 标签页</h4>
                    <Tab
                      size="medium"
                      items={[
                        { key: "1", label: "标签 1 / Tab 1", children: <div>内容 1</div> },
                        { key: "2", label: "标签 2 / Tab 2", children: <div>内容 2</div> },
                        { key: "3", label: "标签 3 / Tab 3", children: <div>内容 3</div> }
                      ]}
                    />
                  </div>

                  <div>
                    <h4>Pagination - 分页</h4>
                    <Pagination
                      currentPage={currentPage}
                      total={100}
                      pageSize={10}
                      onPageChange={(page) => setCurrentPage(page)}
                    />
                  </div>
                </div>
              </section>

              {/* 6. 其他组件 */}
              <section style={{ marginBottom: "40px" }}>
                <Typography variant="h2">6. 其他组件 (Other Components)</Typography>
                <Divider direction="horizontal" />
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px"
                  }}>
                  <div>
                    <h4>Slider - 滑块</h4>
                    <Slider value={sliderValue} onSliderChange={setSliderValue} />
                    <p>当前值 Current value: {sliderValue}</p>
                  </div>

                  <div>
                    <h4>Divider - 分割线</h4>
                    <div>文本上方 Text above</div>
                    <Divider direction="horizontal" />
                    <div>文本下方 Text below</div>
                  </div>

                  <div>
                    <h4>Typography - 文字排版</h4>
                    <Typography variant="h1">标题 1 / Heading 1</Typography>
                    <Typography variant="h2">标题 2 / Heading 2</Typography>
                    <Typography variant="h3">标题 3 / Heading 3</Typography>
                    <Typography variant="body1">正文 1 / Body 1</Typography>
                    <Typography variant="body2">正文 2 / Body 2</Typography>
                  </div>
                </div>
              </section>

              {/* 测试说明 */}
              <section>
                <Alert
                  type="success"
                  content={`✅ 测试完成！已展示 ${
                    direction === "ltr" ? "15+" : "15+"
                  } 个组件。点击顶部按钮切换 LTR/RTL 模式查看效果。`}
                />
                <div
                  style={{
                    marginTop: "20px",
                    padding: "15px",
                    background: "#f5f5f5",
                    borderRadius: "8px"
                  }}>
                  <h3>📋 RTL 测试检查清单：</h3>
                  <ul style={{ lineHeight: "1.8" }}>
                    <li>✓ 文本对齐方向 (Text alignment)</li>
                    <li>✓ 输入框光标位置 (Input cursor position)</li>
                    <li>✓ 按钮组排列顺序 (Button group order)</li>
                    <li>✓ 下拉菜单展开方向 (Dropdown direction)</li>
                    <li>✓ 图标和文本位置 (Icon and text position)</li>
                    <li>✓ Tooltip 弹出位置 (Tooltip popup position)</li>
                    <li>✓ 分页组件方向 (Pagination direction)</li>
                    <li>✓ Tab 标签排列 (Tab order)</li>
                    <li>✓ Checkbox/Radio 标签位置 (Label position)</li>
                    <li>✓ 间距镜像 (Margin/Padding mirror)</li>
                  </ul>
                </div>
              </section>
            </div>
          </NoticeProvider>
        </RTLTestWrapper>
      </ThemeProvider>
    );
  }
};
