import Link from 'next/link';
import React from 'react';
import ReactDragListView from 'react-drag-listview/lib/index.js';


class DragPopular extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dragProps : {
        onDragEnd : this.onDragEnd,
        nodeSelector: 'li',
        handleSelector: 'li'
      }
    }
    
  }

  onDragEnd = (fromIndex, toIndex) => {
    const setCate = this.props.handleCateChange;
    const data  = this.props.cate;
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    // this.props.setCate([]);
    setCate([])
    setCate(data);
  }


  render() {
    return (
      <div className="simple simple1">
        <div className="simple-inner books">
          <ReactDragListView {...this.state.dragProps}>
            <div className="header-text">
                <div className="show-index">#</div>
                <div className="show-name">ชื่อ</div>
                <div className="show-manage text-right"></div>
            </div>
            <ol>
              {
                this.props.cate && this.props.cate.map((item, index) => (
                  <li key={index}>
                    <div className="show-index">{index + 1}</div>
                    <div className="show-name">{item.name_th}</div>
                    <div className="show-manage text-right">
                      {
                        this.props.linkAS != 'test2' && (
                          <Link href={`${this.props.linkHref}`} as={`${this.props.linkAS}/${item.id}`}>
                            <a>แก้ไข</a>
                          </Link>
                        )
                      }
                      
                    </div>
                  </li>
                ))
              }
            </ol>
          </ReactDragListView>
        </div>
      </div>
    );
  }
}

export default DragPopular
