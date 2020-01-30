"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monaco = exports["default"] = void 0;

var monaco = _interopRequireWildcard(require("monaco-editor/esm/vs/editor/editor.api"));

exports.monaco = monaco;

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function noop() {}

var _default2 = {
  name: 'MonacoEditor',
  props: {
    diffEditor: {
      type: Boolean,
      "default": false
    },
    //是否使用diff模式
    width: {
      type: [String, Number],
      "default": '100%'
    },
    height: {
      type: [String, Number],
      "default": '100%'
    },
    original: String,
    //只有在diff模式下有效
    value: String,
    language: {
      type: String,
      "default": 'javascript'
    },
    theme: {
      type: String,
      "default": 'vs'
    },
    options: {
      type: Object,
      "default": function _default() {
        return {};
      }
    },
    editorMounted: {
      type: Function,
      "default": noop
    },
    editorBeforeMount: {
      type: Function,
      "default": noop
    }
  },
  watch: {
    options: {
      deep: true,
      handler: function handler(options) {
        this.editor && this.editor.updateOptions(options);
      }
    },
    value: function value() {
      this.editor && this.value !== this._getValue() && this._setValue(this.value);
    },
    language: function language() {
      if (!this.editor) return;

      if (this.diffEditor) {
        //diff模式下更新language
        var _this$editor$getModel = this.editor.getModel(),
            original = _this$editor$getModel.original,
            modified = _this$editor$getModel.modified;

        monaco.editor.setModelLanguage(original, this.language);
        monaco.editor.setModelLanguage(modified, this.language);
      } else monaco.editor.setModelLanguage(this.editor.getModel(), this.language);
    },
    theme: function theme() {
      this.editor && monaco.editor.setTheme(this.theme);
    },
    style: function style() {
      var _this = this;

      this.editor && this.$nextTick(function () {
        _this.editor.layout();
      });
    }
  },
  computed: {
    style: function style() {
      return {
        width: !/^\d+$/.test(this.width) ? this.width : "".concat(this.width, "px"),
        height: !/^\d+$/.test(this.height) ? this.height : "".concat(this.height, "px")
      };
    }
  },
  mounted: function mounted() {
    this.initMonaco();
  },
  beforeDestroy: function beforeDestroy() {
    this.editor && this.editor.dispose();
  },
  render: function render(h) {
    return h("div", {
      "class": "monaco_editor_container",
      style: this.style
    });
  },
  methods: {
    initMonaco: function initMonaco() {
      var value = this.value,
          language = this.language,
          theme = this.theme,
          options = this.options;
      Object.assign(options, this._editorBeforeMount()); //编辑器初始化前

      this.editor = monaco.editor[this.diffEditor ? 'createDiffEditor' : 'create'](this.$el, _objectSpread({
        value: value,
        language: language,
        theme: theme
      }, options));
      this.diffEditor && this._setModel(this.value, this.original);

      this._editorMounted(this.editor); //编辑器初始化后

    },
    _getEditor: function _getEditor() {
      if (!this.editor) return null;
      return this.diffEditor ? this.editor.modifiedEditor : this.editor;
    },
    _setModel: function _setModel(value, original) {
      //diff模式下设置model
      var language = this.language;
      var originalModel = monaco.editor.createModel(original, language);
      var modifiedModel = monaco.editor.createModel(value, language);
      this.editor.setModel({
        original: originalModel,
        modified: modifiedModel
      });
    },
    _setValue: function _setValue(value) {
      var editor = this._getEditor();

      if (editor) return editor.setValue(value);
    },
    _getValue: function _getValue() {
      var editor = this._getEditor();

      if (!editor) return '';
      return editor.getValue();
    },
    _editorBeforeMount: function _editorBeforeMount() {
      var options = this.editorBeforeMount(monaco);
      return options || {};
    },
    _editorMounted: function _editorMounted(editor) {
      var _this2 = this;

      this.editorMounted(editor, monaco);

      if (this.diffEditor) {
        editor.onDidUpdateDiff(function (event) {
          var value = _this2._getValue();

          _this2._emitChange(value, event);
        });
      } else {
        editor.onDidChangeModelContent(function (event) {
          var value = _this2._getValue();

          _this2._emitChange(value, event);
        });
      }
    },
    _emitChange: function _emitChange(value, event) {
      this.$emit('change', value, event);
      this.$emit('input', value);
    }
  }
};
exports["default"] = _default2;