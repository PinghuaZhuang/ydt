const AccessMange = (props) => {
  const a = "中文222";
  return (
    <Select style={{ width: 180 }}>
      <SelectOption value="我是中文">
        活动营销
        <span>hahah</span>
        <span>我是中文</span>
      </SelectOption>
    </Select>
  );
};

export default connect(({ accessManage }) => ({
  accessManage,
}))(AccessMange);
