const htmlparser2 = require("htmlparser2");

const map = {}
// let curTagName
let count = 0;

const parser = new htmlparser2.Parser({
  onopentag(name, attributes) {
    map[name] = (map[name] ?? 0) + 1;
    count++;
    console.log('======> onopentag', name)
      /*
       * This fires when a new tag is opened.
       *
       * If you don't need an aggregated `attributes` object,
       * have a look at the `onopentagname` and `onattribute` events.
       */
      // if (name === "script" && attributes.type === "text/javascript") {
      //     console.log("JS! Hooray!");
      // }
  },
  ontext(text) {
      /*
       * Fires whenever a section of text was processed.
       *
       * Note that this can fire at any point within text and you might
       * have to stich together multiple pieces.
       */
      if (count > 0) {
        console.log("-->", text);
      }
  },
  onclosetag(tagname) {
    map[tagname]--;
    count--;
    console.log('<====== onclosetag', tagname)
      /*
       * Fires when a tag is closed.
       *
       * You can rely on this event only firing when you have received an
       * equivalent opening tag before. Closing tags without corresponding
       * opening tags will be ignored.
       */
      // if (tagname === "script") {
      //     console.log("That's it?!");
      // }
  },
});
parser.write(
  `import React, { useEffect, useState, useRef } from "react";
  import { useIntl } from "umi";
  import { connect } from "dva";
  import { Button, Select, message } from "antd";
  import Table from "@/components/DefaultTable";
  import MenuLabel from "../../../components/MenuLabel";
  import AccessPop from "./AccessPop";
  import styles from "./index.less";

  const SelectOption = Select.Option;
  const AccessMange = (props) => {
    const { dispatch, accessManage } = props;
    const { loading, authorizations } = accessManage;
    const intl = useIntl();
    const tableDomRef = useRef();
    const [scrollHeight, setScrollHeight] = useState(0); // 表格滚动高度
    const [pageSize, setPageSize] = useState(10); // 表格当前每页条数
    const [pageNum, setPageNum] = useState(1); // 表格当前页数
    const [showAccess, setShowAccess] = useState(false);
    const [accessObj, setAccessObj] = useState({});

    // 获取权限信息列表
    const getAuthorizations = () => {
      const obj = { pageSize, pageNum };
      dispatch({
        type: "accessManage/getAuthorizations",
        payload: obj,
      });
    };
    // 打开编辑用户弹窗
    const handleShowEdit = (record) => {
      setAccessObj(record);
      setShowAccess(true);
    };

    // 表格列的配置
    const columns = [
      {
        title: () => (
          <div style={{ color: "#7e869b" }}>
            {intl.formatMessage({ id: "pages.systemSettings.module" })}
          </div>
        ),
        dataIndex: "moduleName",
        key: "moduleName",
        render: (moduleName) => {
          return <div style={{ color: "#333" }}>{moduleName || "--"}</div>;
        },
      },
      {
        title: () => (
          <div style={{ color: "#7e869b" }}>
            {intl.formatMessage({ id: "pages.systemSettings.menuName" })}
          </div>
        ),
        dataIndex: "name",
        key: "name",
        render: (name) => {
          return <div style={{ color: "#333" }}>{name || "--"}</div>;
        },
      },
      {
        title: () => (
          <div style={{ color: "#7e869b" }}>
            {intl.formatMessage({ id: "pages.systemSettings.code" })}
          </div>
        ),
        dataIndex: "code",
        key: "code",
        render: (code) => {
          return <div style={{ color: "#333" }}>{code || "--"}</div>;
        },
      },
      {
        title: () => (
          <div style={{ color: "#7e869b" }}>
            {intl.formatMessage({ id: "pages.systemSettings.status" })}
          </div>
        ),
        dataIndex: "enable",
        key: "enable",
        render: (enable) => {
          return (
            <div style={{ color: "#333" }}>
              {enable
                ? intl.formatMessage({ id: "pages.systemSettings.status.enable" })
                : intl.formatMessage({
                    id: "pages.systemSettings.status.disable",
                  })}
            </div>
          );
        },
      },
      {
        title: () => (
          <div style={{ color: "#7e869b" }}>
            {intl.formatMessage({ id: "pages.searchTable.titleOption" })}
          </div>
        ),
        dataIndex: "code",
        key: "edit",
        render: (text, record) => (
          <div style={{ marinTop: "100px" }}>
            <span
              type="text"
              style={{
                color: "#3B73E6",
                marginRight: "1.66vw",
                cursor: "pointer",
              }}
              onClick={() => {
                handleShowEdit(record);
              }}
            >
              {intl.formatMessage({ id: "pages.searchTable.edit" })}
            </span>
          </div>
        ),
      },
    ];

    // 分页器
    const pagination = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize,
      total: authorizations.total,
      current: pageNum,
      showTotal: (total) => {
        return "共共条共";
      },
    };

    // 编辑-提交
    const handleSubmit = (obj, func) => {
      const params = { ...accessObj, ...obj };

      dispatch({
        type: "accessManage/exitAuthorizations",
        payload: params,
        cb: () => {
          getAuthorizations();
          func();
          setShowAccess(false);
          message.success("修改成功");
        },
      });
    };

    // 编辑-关闭
    const handleCancel = () => {
      setShowAccess(false);
    };

    // 表格属性修改
    const tableChange = (pagination) => {
      const { current, pageSize } = pagination;
      setPageNum(current);
      setPageSize(pageSize);
    };
    /**
     * 获取第一个表格的可视化高度
     * @param {*} extraHeight 额外的高度(表格底部的内容高度 Number类型,默认为74)
     * @param {*} id 当前页面中有多个table时需要制定table的id
     */
    const getTableScroll = ({ extraHeight, id }) => {
      if (typeof extraHeight == "undefined") {
        //  默认底部分页54 + 边距10
        extraHeight = 64;
      }
      let tHeader = null;
      if (id) {
        tHeader = document.getElementById(id)
          ? document
              .getElementById(id)
              .getElementsByClassName("ant-table-thead")[0]
          : null;
      } else {
        tHeader = document.getElementsByClassName("ant-table-thead")[0];
      }
      // 表格内容距离顶部的距离
      let tHeaderBottom = 0;
      if (tHeader) {
        tHeaderBottom = tHeader.getBoundingClientRect().height;
      }
      // 窗体高度-表格内容顶部的高度-表格内容底部的高度
      const height =
        tableDomRef.current.scrollHeight - tHeaderBottom - extraHeight;
      return height;
    };

    useEffect(() => {
      setScrollHeight(getTableScroll({ id: "authorizationsTable" }));
    }, []);

    useEffect(() => {
      getAuthorizations();
    }, [pageSize, pageNum]);

    return (
      <div className={styles.container}>
        <div className={styles.topCon}>
          <MenuLabel
            pathName={intl.formatMessage({
              id: "menu.systemSettings.permissionManage",
            })}
          />
          <div className={styles.searchCon} hidden>
            <span className={styles.searchLabel}>
              {intl.formatMessage({ id: "pages.systemSettings.module" })}:
            </span>
            <Select style={{ width: 180 }}>
              <SelectOption value="我是中文">
                活动营销
                <span>hahah</span>
                <span>我是中文</span>
              </SelectOption>
            </Select>
          </div>
        </div>

        <div className={styles.tableCon} ref={tableDomRef}>
          <Table
            id="authorizationsTable"
            rowKey="code"
            columns={columns}
            dataSource={authorizations.list}
            bordered={false}
            pagination={pagination}
            onChange={tableChange}
            scroll={{ y: scrollHeight }}
          />
        </div>
        {showAccess && (
          <AccessPop
            data={accessObj}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
          />
        )}
      </div>
    );
  };

  export default connect(({ accessManage }) => ({
    accessManage,
  }))(AccessMange);
  `
);
parser.end();
