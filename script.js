const WORD_LIMIT = 500;
const storyInput = document.getElementById('story-input');
const splitStoryButton = document.getElementById('split-story');
const storyInputWordCount = document.getElementById('story-input-word-count');
const storyPartsDisplay = document.querySelector('.story-parts-display');

const countWords = (text) => text.trim().split(' ').length;

function getStoryParagraphs(rawStory) {
  const trimmedStory = rawStory
    .trim()
    .replace('\n\n\n', '\n\n')
    .replace('\n\n\n\n', '\n\n')
    .replace('\n\n\n\n\n', '\n\n');

  return trimmedStory.split('\n\n');
}

function splitStory(paragraphs) {
  const storyParts = [];
  const continuePart = (i) => {
    if (storyParts.length === 0) return true

    const currentPart = storyParts[storyParts.length - 1];
    const currentPartWL = countWords(currentPart);
    const paragraphWL = countWords(paragraphs[i]);

    if (currentPartWL + paragraphWL <= WORD_LIMIT) return true;
    if (currentPartWL <= WORD_LIMIT - 100 && currentPartWL + paragraphWL <= WORD_LIMIT + 60) return true;
    return false;
  };

  for (let i = 0; i < paragraphs.length; i++) {
    if (storyParts.length === 0) {
      storyParts.push(paragraphs[0]);
    } else {
      if (continuePart(i)) {
        const currentPart = storyParts[storyParts.length - 1];
        storyParts[storyParts.length - 1] = [currentPart, paragraphs[i]].join('\n\n');
      } else {
        storyParts.push(paragraphs[i]);
      }
    }
  }

  return storyParts.map((part, i) => `Parte ${i + 1}/${storyParts.length}\n\n${part}`);
}

function displayParts(storyParts) {
  storyParts.forEach((storyPart) => {
    const part = document.createElement('div');
    const text = document.createElement('p');
    const copyText = document.createElement('button');

    text.innerText = storyPart;
    copyText.innerText = 'Copy Text';
    copyText.addEventListener('click', () => {
      navigator.clipboard.writeText(text.innerText);

      copyText.disabled = true;
      copyText.innerText = 'Copied!';

      setTimeout(() => {
        copyText.innerText = 'Copy Text';
        copyText.disabled = false;
      }, 600);
    });

    part.appendChild(text);
    part.appendChild(copyText);
    storyPartsDisplay.appendChild(part);
  });
}

function clearDisplay() {
  while (storyPartsDisplay.firstChild) {
    const firstChild = storyPartsDisplay.firstChild;
    storyPartsDisplay.removeChild(firstChild);
  }
}

storyInput.addEventListener('keyup', () => {
  storyInputWordCount.innerText = `${countWords(storyInput.value)}`;
});

splitStoryButton.addEventListener('click', () => {
  clearDisplay();

  const paragraphs = getStoryParagraphs(storyInput.value);
  const storyParts = splitStory(paragraphs);

  displayParts(storyParts);
});
