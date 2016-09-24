'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _electron = require('electron');

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var FONT_AWESOME_COMPONENT = 'com.robinmalfait.font-awesome';

var BASE = "https://rbn.nu/fa/list";

exports.default = function (robot) {
  var React = robot.dependencies.React;
  var Blank = robot.cards.Blank;
  var _robot$UI = robot.UI;
  var A = _robot$UI.A;
  var Button = _robot$UI.Button;
  var Icon = _robot$UI.Icon;
  var Collection = _robot$UI.Collection;
  var CollectionItem = _robot$UI.CollectionItem;
  var restorableComponent = robot.restorableComponent;
  var enhance = robot.enhance;


  var FA = React.createClass({
    displayName: 'FA',
    getInitialState: function getInitialState() {
      return {
        list: [],
        latest_version: {
          tag: 'Unknown',
          url: ''
        },
        selected_version: null,
        icons: []
      };
    },
    componentDidMount: function componentDidMount() {
      var _this = this;

      robot.fetchJson(BASE).then(function (data) {
        _this.setState({
          list: data,
          latest_version: data[0]
        });
      });
    },
    setSelectedVersion: function setSelectedVersion(e, version) {
      var _this2 = this;

      e.preventDefault();

      if (version != null) {
        robot.fetchJson(version.url).then(function (data) {
          return _this2.setState({ icons: data, selected_version: version });
        });
      } else {
        this.setState({ selected_version: version, icons: [] });
      }
    },
    handleCopy: function handleCopy(icon) {
      _electron.clipboard.writeText(icon.class.replace('fa ', ''));

      robot.notify('The icon class has been copied to your clipboard.');
    },
    renderIcons: function renderIcons() {
      var _this3 = this;

      var icons = this.state.icons;


      return React.createElement(
        Collection,
        { style: { maxHeight: 450 } },
        icons.map(function (icon) {
          return React.createElement(
            CollectionItem,
            { key: icon.class },
            React.createElement(Icon, { icon: icon.class.replace('fa fa-', '') }),
            ' ',
            icon.name,
            React.createElement(
              Button,
              { className: 'right', onClick: function onClick() {
                  return _this3.handleCopy(icon);
                } },
              React.createElement(Icon, { icon: 'copy' })
            ),
            React.createElement(
              'small',
              { className: 'right muted', style: { marginRight: 15 } },
              icon.aliases.join(', ')
            )
          );
        })
      );
    },
    renderVersions: function renderVersions(list) {
      var _this4 = this;

      return React.createElement(
        Collection,
        { style: { maxHeight: 450 } },
        list.map(function (version) {
          return React.createElement(
            CollectionItem,
            { key: version.tag },
            React.createElement(
              A,
              { href: '#', onClick: function onClick(e) {
                  return _this4.setSelectedVersion(e, version);
                } },
              version.tag
            )
          );
        })
      );
    },
    render: function render() {
      var _this5 = this;

      var other = _objectWithoutProperties(this.props, []);

      var _state = this.state;
      var list = _state.list;
      var icons = _state.icons;
      var latest_version = _state.latest_version;
      var selected_version = _state.selected_version;


      return React.createElement(
        Blank,
        _extends({ title: 'Font-Awesome' }, other),
        React.createElement(
          'h4',
          null,
          selected_version == null ? React.createElement(
            'span',
            null,
            'Choose a version:'
          ) : React.createElement(
            'span',
            null,
            'List of icons (',
            icons.length,
            ')'
          )
        ),
        selected_version == null ? this.renderVersions(list) : this.renderIcons(),
        React.createElement(
          'small',
          { className: 'left' },
          list.length,
          ' versions - (latest version: ',
          React.createElement(
            A,
            { href: '#',
              onClick: function onClick(e) {
                return _this5.setSelectedVersion(e, latest_version);
              } },
            latest_version.tag
          ),
          ')'
        ),
        React.createElement(
          'small',
          { className: 'right' },
          React.createElement(
            A,
            { href: '#', onClick: function onClick(e) {
                return _this5.setSelectedVersion(e, null);
              } },
            'reset'
          )
        )
      );
    }
  });

  robot.registerComponent(enhance(FA, [restorableComponent]), FONT_AWESOME_COMPONENT);

  robot.listen(/^fa$/, {
    description: "font awesome",
    usage: 'fa'
  }, function () {
    robot.addCard(FONT_AWESOME_COMPONENT);
  });
};