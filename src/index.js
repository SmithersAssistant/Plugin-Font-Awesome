import { clipboard } from 'electron'

const FONT_AWESOME_COMPONENT = 'com.robinmalfait.font-awesome'

const BASE = "https://rbn.nu/fa/list"

export default robot => {
  const { React } = robot.dependencies
  const { Blank } = robot.cards
  const { A, Button, Icon, Collection, CollectionItem } = robot.UI
  const { restorableComponent, enhance } = robot

  const FA = React.createClass({
    getInitialState() {
      return {
        list: [],
        latest_version: {
          tag: 'Unknown',
          url: ''
        },
        selected_version: null,
        icons: []
      }
    },
    componentDidMount() {
      robot.fetchJson(BASE)
        .then(data => {
          this.setState({
            list: data,
            latest_version: data[ 0 ]
          })
        });
    },
    setSelectedVersion(e, version) {
      e.preventDefault()

      if (version != null) {
        robot.fetchJson(version.url).then(data => this.setState({ icons: data, selected_version: version }))
      } else {
        this.setState({ selected_version: version, icons: [] })
      }

    },
    handleCopy(icon) {
      clipboard.writeText(icon.class.replace('fa ', ''))

      robot.notify(`The icon class has been copied to your clipboard.`)
    },
    renderIcons() {
      const { icons } = this.state

      return (
        <Collection style={{ maxHeight: 450 }}>
          {icons.map(icon => (
            <CollectionItem key={icon.class}>
              <Icon icon={icon.class.replace('fa fa-', '')}/> {icon.name}
              <Button className="right" onClick={() => this.handleCopy(icon)}><Icon icon="copy"/></Button>
              <small className="right muted" style={{ marginRight: 15 }}>{icon.aliases.join(', ')}</small>
            </CollectionItem>
          ))}
        </Collection>
      )
    },
    renderVersions(list) {
      return (
        <Collection style={{ maxHeight: 450 }}>
          {list.map(version => (
            <CollectionItem key={version.tag}>
              <A href="#" onClick={(e) => this.setSelectedVersion(e, version)}>{version.tag}</A>
            </CollectionItem>
          ))}
        </Collection>
      )
    },
    render() {
      const { ...other } = this.props
      const { list, icons, latest_version, selected_version } = this.state

      return (
        <Blank title="Font-Awesome" {...other}>
          <h4>{selected_version == null ? (
            <span>Choose a version:</span>
          ) : (
            <span>List of icons ({icons.length})</span>
          )}</h4>

          {selected_version == null ? this.renderVersions(list) : this.renderIcons()}
          <small className="left">{list.length} versions - (latest version: <A href="#"
                                                                               onClick={(e) => this.setSelectedVersion(e, latest_version)}>{latest_version.tag}</A>)
          </small>
          <small className="right"><A href="#" onClick={(e) => this.setSelectedVersion(e, null)}>reset</A></small>
        </Blank>
      )
    }
  })

  robot.registerComponent(enhance(FA, [
    restorableComponent
  ]), FONT_AWESOME_COMPONENT);

  robot.listen(/^fa$/, {
    description: "font awesome",
    usage: 'fa'
  }, () => {
    robot.addCard(FONT_AWESOME_COMPONENT)
  })
}
