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
    const setProduct = this.props.handleCateChange;
    const data  = this.props.products.rows;
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    // this.props.setCate([]);
    setProduct([])
    setProduct(data);
  }


  render() {
    return (
      <div className="simple simple1">
        <div className="simple-inner drag-book">
          <ReactDragListView {...this.state.dragProps}>
            <div className="header-text">
                <div className="show-index">NO.</div>
                <div className="show-name">Name</div>
                <div className="show-manage"></div>
            </div>
            <ol>
              {
                (this.props.products && this.props.products.count > 0) && this.props.products.rows.map((item, index) => (
                  <li key={index}>
                    <div className="show-index">{index + 1}</div>
                    <div className="show-name">{item.product.name}</div>
                    <div className="show-manage">
                      <button className="a-manage danger w-100px" onClick={() => this.props.delProduct(item.id)}><i className="fa fa-fw fa-trash"></i> <span>Delete</span></button>
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
