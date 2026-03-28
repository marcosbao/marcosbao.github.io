import { Crepe, CrepeFeature } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/reset.css';
import '@milkdown/crepe/theme/common/prosemirror.css';
import '@milkdown/crepe/theme/common/toolbar.css';
import '@milkdown/crepe/theme/common/link-tooltip.css';
import '@milkdown/crepe/theme/common/image-block.css';
import '@milkdown/crepe/theme/common/placeholder.css';
import '@milkdown/crepe/theme/common/list-item.css';
import '@milkdown/crepe/theme/common/block-edit.css';
import '@milkdown/crepe/theme/common/cursor.css';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/classic.css';
import { marked } from 'marked';

const shell = document.querySelector('[data-editor-shell]') as HTMLDivElement | null;
const titleInput = document.getElementById('post-title') as HTMLInputElement | null;
const editorRoot = document.getElementById('milkdown-root');
const previewTitle = document.getElementById('preview-title');
const previewRoot = document.getElementById('preview-content');

if (!shell || !editorRoot || !previewRoot) {
  throw new Error('Editor elements not found');
}

const initialTitle = shell.dataset.initialTitle || '';
const initialValue = shell.dataset.initialValue || '';

marked.setOptions({
  breaks: true,
  gfm: true
});

const renderPreview = (markdown: string) => {
  previewRoot.innerHTML = marked.parse(markdown || '') as string;
};

const syncTitle = (title: string) => {
  if (!previewTitle) return;
  previewTitle.textContent = title.trim() || '未命名文章';
};

syncTitle(initialTitle);
renderPreview(initialValue);

titleInput?.addEventListener('input', (event) => {
  syncTitle((event.target as HTMLInputElement).value);
});

const editor = new Crepe({
  root: editorRoot,
  defaultValue: initialValue,
  features: {
    [Crepe.Feature.Cursor]: true,
    [Crepe.Feature.ListItem]: true,
    [Crepe.Feature.LinkTooltip]: true,
    [Crepe.Feature.ImageBlock]: true,
    [Crepe.Feature.BlockEdit]: false,
    [Crepe.Feature.Placeholder]: true,
    [Crepe.Feature.Toolbar]: true,
    [Crepe.Feature.CodeMirror]: false,
    [Crepe.Feature.Table]: false,
    [Crepe.Feature.Latex]: false
  },
  featureConfigs: {
    [Crepe.Feature.Placeholder]: {
      text: '写正文',
      mode: 'block'
    }
  }
});

editor.on((listener) => {
  listener.markdownUpdated((_, markdown) => {
    renderPreview(markdown);
  });
});

await editor.create();
renderPreview(editor.getMarkdown());
