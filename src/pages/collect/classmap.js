import React, { Component } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { connect } from 'umi'
import { Spin } from 'antd'

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const move = (source, destination, droppableSource, droppableDestination) => {
  const sourceClone = Array.from(source)
  const destClone = Array.from(destination)
  const [removed] = sourceClone.splice(droppableSource.index, 1)

  destClone.splice(droppableDestination.index, 0, removed)

  const result = {}
  result[droppableSource.droppableId] = sourceClone
  result[droppableDestination.droppableId] = destClone
  return result
}

const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: '0 5px',
  margin: '5px 0 0 5px',
  display: 'inline-block',
  color: isDragging ? '#ddd' : '#000',
  borderRadius: 3,
  backgroundColor: '#f5f6f7',
  ...draggableStyle
})

const getCollectClassStyle = isDraggingOver => ({
  padding: 10,
  width: '100%',
  boxShadow: '0 0 1px #000',
  display: 'display',
  overflow: 'auto'
})

const getListStyle = isDraggingOver => ({
  padding: 10,
  boxShadow: '0 0 1px #000',
  display: 'inline-block',
  margin: '10px 5px',
  width: 120,
})

const DROPPABLE_KEY_PREFIX = 'videoType_'
const draggableRender = classmapList => {
  if (classmapList && classmapList.length) {
    return (classmapList.map((item, index) => (
      <Draggable
        key={`${item.ctid}`}
        draggableId={`${item.ctid}`}
        index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(
              snapshot.isDragging,
              provided.draggableProps.style
            )}>
            {item.ctname}
          </div>
        )}
      </Draggable>
    )))
  }
}

const droppableRender = (dataList = [], classmap) => {
  if (dataList && dataList.length) {
    return (dataList.map((item, index) => {
      return (
        <Droppable key={`${DROPPABLE_KEY_PREFIX}${item.id}`}
          droppableId={`${DROPPABLE_KEY_PREFIX}${item.id}`}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(provided.isDraggingOver)}>
              <div style={{
                marginLeft: 5, paddingLeft: 5,
                boxShadow: '0px 1px 0px #f57676'
              }}>{item.name}:</div>
              {draggableRender(classmap[`${DROPPABLE_KEY_PREFIX}${item.id}`])}
              {provided.placeholder}
            </div>
          )}
        </Droppable>)
    }))
  }
}

@connect(({ videoClass, classmap, collect,
  loading }) => ({
    videoClass, classmap, collect,
    loading
  }))
class ClassMap extends Component {
  state = {
    collectClass: [],
    classMaps: {}
  }

  getList = id => this.state[id]

  onDragEnd = result => {
    // draggableId = 被拖动的class.ctid
    // source.droppableId = 要移除的来源
    // destination.droppableId = 要添加的vtid
    const { source, destination, draggableId } = result
    if (!destination) return
    let dragedItem = this.state[source.droppableId].find(c => parseInt(c.ctid) === parseInt(draggableId))
    dragedItem = { ...dragedItem }
    dragedItem['cid'] = this.props.collect.collectId
    dragedItem['vtid'] = parseInt(destination.droppableId.split('_')[1]) || 0

    if (source.droppableId === destination.droppableId) {
      // 同框排序
      const items = reorder(this.getList(source.droppableId), source.index, destination.index)
      let state = {}
      state[source.droppableId] = items
      this.setState(state)
    } else {
      // 异框移动
      const result = move(
        this.getList(source.droppableId),
        this.getList(destination.droppableId),
        source,
        destination
      )
      this.setState(result, () => {
        this.props.dispatch({
          type: 'classmap/save',
          payload: dragedItem
        })
      })
    }
  }

  componentDidMount() {
    const { dispatch, collect: { collectId } } = this.props
    if (collectId) {
      let classMaps = {}, collectClass = [], classmapslist = []
      const videoClassDispatch = dispatch({
        type: 'videoClass/queryList',
        payload: { preid: 0 },
        callback: res => {
          if (res.code === 200) {
            res.data.forEach(c => {
              classMaps[`${DROPPABLE_KEY_PREFIX}${c.id}`] = []
            })
          }
        }
      })
      const collectClassDispatch = dispatch({
        type: 'collect/queryClass',
        payload: { id: collectId },
        callback: res => {
          collectClass = res.code === 200 ? res.data : []
        }
      })
      const classmapDispatch = dispatch({
        type: 'classmap/queryList',
        payload: { cid: collectId },
        callback: res => {
          classmapslist = res.code === 200 ? res.data : []
        }
      })

      Promise.all([videoClassDispatch, collectClassDispatch, classmapDispatch])
        .then(() => {
          classmapslist.forEach(c => { classMaps[`${DROPPABLE_KEY_PREFIX}${c.vtid}`].push(c) })
          collectClass = collectClass.filter(c => !classmapslist.some(l => l.ctid === (parseInt(c.ctid) || 0)))
          this.setState({ ...classMaps, collectClass })
        })
    }
  }

  render() {
    const { videoClass, loading } = this.props
    const videoClassList = videoClass.dataList
    return (
      <Spin spinning={loading.models.classmap}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1px' }}>
          <DragDropContext onDragEnd={this.onDragEnd}>
            <Droppable droppableId="collectClass" direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  style={getCollectClassStyle(provided.isDraggingOver)}>
                  <div style={{
                    marginLeft: 5, paddingLeft: 5, width: 100,
                    boxShadow: '0px 1px 0px #f57676'
                  }}>待设定类型:</div>
                  {draggableRender(this.state.collectClass)}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {droppableRender(videoClassList, this.state)}
          </DragDropContext>
        </div>
      </Spin>
    )
  }
}

export default ClassMap