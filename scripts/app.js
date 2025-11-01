/*
 * Portions of this file are adapted from the Buster browser extension
 * Copyright (C) 2018-2024 Buster contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import audioBufferToWav from 'https://esm.sh/audiobuffer-to-wav@1.0.0';

import {
  captchaGoogleSpeechApiLangCodes,
  captchaIbmSpeechApiLangCodes,
  captchaMicrosoftSpeechApiLangCodes,
  captchaWitSpeechApiLangCodes,
  microsoftSpeechApiRegions
} from './data.js';

const serviceSelect = document.querySelector('#service');
const languageSelect = document.querySelector('#language');
const serviceConfigContainer = document.querySelector('#service-config');
const speechForm = document.querySelector('#speech-form');
const submitBtn = document.querySelector('#submit-btn');
const outputEl = document.querySelector('#speech-output');
const fallbackCheckbox = document.querySelector('#fallback');
const audioInput = document.querySelector('#audio');

const languageMaps = {
  wit: captchaWitSpeechApiLangCodes,
  google: captchaGoogleSpeechApiLangCodes,
  ibm: captchaIbmSpeechApiLangCodes,
  microsoft: captchaMicrosoftSpeechApiLangCodes
};

const displayNames = new Intl.DisplayNames(['en'], {type: 'language'});
const languageDisplayOverrides = {
  'es-419': 'es-ES',
  iw: 'he',
  pt: 'pt-PT',
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-PT',
  fil: 'fil',
  zh: 'zh-CN'
};

const trimOptions = {trimStart: 1.5, trimEnd: 1.5};

function setOutput(message, state = 'neutral') {
  const stamp = new Date().toLocaleTimeString();
  let prefix = '[info]';
  if (state === 'error') {
    prefix = '[error]';
  } else if (state === 'success') {
    prefix = '[ok]';
  }
  outputEl.innerHTML = `<div class="${state}"><strong>${prefix} ${stamp}</strong></div><div>${message}</div>`;
}

function toggleLoading(isLoading) {
  submitBtn.disabled = isLoading;
  serviceSelect.disabled = isLoading;
  audioInput.disabled = isLoading;
  if (isLoading) {
    setOutput('Preparing audio and contacting the speech service...', 'status');
  }
}

function getServiceInputs(service) {
  const templates = {
    wit: () => `
      <div class="field-group">
        <label for="wit-api-key">Wit.ai server access token</label>
        <input id="wit-api-key" name="witApiKey" type="text" placeholder="Paste your Wit.ai API key" required />
        <p class="help-text">The key must have speech permissions enabled. Create one at wit.ai &gt; Settings &gt; Server Access Token.</p>
      </div>
    `,
    google: () => `
      <div class="field-group">
        <label for="google-api-key">Google Cloud API key</label>
        <input id="google-api-key" name="googleApiKey" type="text" placeholder="AIza..." required />
        <p class="help-text">Enable the Speech-to-Text API in Google Cloud and use an unrestricted key or allow the current origin.</p>
      </div>
    `,
    ibm: () => `
      <div class="field-group">
        <label for="ibm-api-url">IBM Speech-to-Text service URL</label>
        <input id="ibm-api-url" name="ibmApiUrl" type="url" placeholder="https://api.region.speech-to-text.watson.cloud.ibm.com" required />
      </div>
      <div class="field-group">
        <label for="ibm-api-key">IBM API key</label>
        <input id="ibm-api-key" name="ibmApiKey" type="text" placeholder="Your IBM Cloud API key" required />
      </div>
    `,
    microsoft: () => `
      <div class="field-group">
        <label for="azure-region">Azure Speech region</label>
        <select id="azure-region" name="azureRegion" required>
          ${microsoftSpeechApiRegions
            .map(region => `<option value="${region}">${region}</option>`)
            .join('')}
        </select>
      </div>
      <div class="field-group">
        <label for="azure-api-key">Azure Speech API key</label>
        <input id="azure-api-key" name="azureApiKey" type="text" placeholder="Your Azure Speech key" required />
      </div>
    `
  };

  return templates[service]?.() ?? '';
}

function renderServiceConfig(service) {
  serviceConfigContainer.dataset.service = service;
  serviceConfigContainer.innerHTML = getServiceInputs(service);
}

function formatLanguageLabel(code, service) {
  const queryCode = languageDisplayOverrides[code] ?? code;

  const baseLabel = (() => {
    try {
      return displayNames.of(queryCode);
    } catch (err) {
      return null;
    }
  })();

  const serviceCode = languageMaps[service]?.[code];
  const extra = serviceCode && serviceCode !== code ? ` -> ${serviceCode}` : '';
  return `${baseLabel ?? code} (${code})${extra}`;
}

function populateLanguages(service) {
  const map = languageMaps[service];
  languageSelect.innerHTML = '';

  Object.entries(map)
    .filter(([, serviceCode]) => typeof serviceCode === 'string' && serviceCode.length)
    .forEach(([code]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = formatLanguageLabel(code, service);
      languageSelect.appendChild(option);
    });

  if (!languageSelect.value && languageSelect.options.length) {
    languageSelect.value = 'en';
  }
}

serviceSelect.addEventListener('change', () => {
  const service = serviceSelect.value;
  renderServiceConfig(service);
  populateLanguages(service);
});

async function normalizeAudio(buffer) {
  const ctx = new AudioContext();
  const decoded = await ctx.decodeAudioData(buffer.slice(0));
  await ctx.close();

  const frameCount = Math.ceil(decoded.duration * 16000);
  const offlineCtx = new OfflineAudioContext(1, frameCount, 16000);
  const source = offlineCtx.createBufferSource();
  source.buffer = decoded;
  source.connect(offlineCtx.destination);
  source.start();

  return offlineCtx.startRendering();
}

async function sliceAudio({audioBuffer, start, end}) {
  const {sampleRate, numberOfChannels, length} = audioBuffer;

  const startOffset = Math.max(0, Math.min(length - 1, Math.floor(sampleRate * start)));
  const endSample = Math.max(startOffset + 1, Math.min(length, Math.floor(sampleRate * end)));
  const sliceDuration = Math.max(1, endSample - startOffset);

  const ctx = new AudioContext();
  const outputBuffer = ctx.createBuffer(numberOfChannels, sliceDuration, sampleRate);
  await ctx.close();

  const tempArray = new Float32Array(sliceDuration);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    audioBuffer.copyFromChannel(tempArray, channel, startOffset);
    outputBuffer.copyToChannel(tempArray, channel, 0);
  }

  return outputBuffer;
}

async function prepareAudio(buffer, options = {}) {
  const audioBuffer = await normalizeAudio(buffer);
  const start = Math.max(0, options.trimStart ?? 0);
  const tentativeEnd = audioBuffer.duration - (options.trimEnd ?? 0);
  const end = Math.max(start + 0.25, tentativeEnd);
  const audioSlice = await sliceAudio({
    audioBuffer,
    start,
    end
  });

  return audioBufferToWav(audioSlice);
}

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const length = bytes.byteLength;
  for (let i = 0; i < length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function ensureUrl(url) {
  try {
    return new URL(url).toString().replace(/\/$/, '');
  } catch (err) {
    throw new Error('IBM service URL must be a valid HTTPS URL.');
  }
}

async function getWitSpeech(apiKey, audioContent) {
  const rsp = await fetch('https://api.wit.ai/speech?v=20240304', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    body: new Blob([audioContent], {type: 'audio/wav'}),
    credentials: 'omit'
  });

  if (rsp.status === 429) {
    throw new Error('Wit.ai rate limit exceeded. Wait a few seconds and try again.');
  }

  if (!rsp.ok) {
    const msg = await rsp.text();
    throw new Error(`Wit.ai error: ${rsp.status} ${msg}`);
  }

  const text = await rsp.text();
  const payload = text.trim().split('\r\n').filter(Boolean).at(-1);
  try {
    const data = JSON.parse(payload);
    return data.text?.trim() ?? '';
  } catch (err) {
    return '';
  }
}

async function getGoogleSpeech(apiKey, audioContent, language, detectAlt) {
  const body = {
    audio: {
      content: arrayBufferToBase64(audioContent)
    },
    config: {
      encoding: 'LINEAR16',
      languageCode: language,
      model: 'video',
      sampleRateHertz: 16000
    }
  };

  if (!['en-US', 'en-GB'].includes(language) && detectAlt) {
    body.config.model = 'default';
    body.config.alternativeLanguageCodes = ['en-US'];
  }

  const rsp = await fetch(
    `https://speech.googleapis.com/v1p1beta1/speech:recognize?key=${encodeURIComponent(apiKey)}`,
    {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {'Content-Type': 'application/json'},
      credentials: 'omit'
    }
  );

  if (!rsp.ok) {
    const msg = await rsp.text();
    throw new Error(`Google Speech error: ${rsp.status} ${msg}`);
  }

  const data = await rsp.json();
  return data.results?.[0]?.alternatives?.[0]?.transcript?.trim() ?? '';
}

async function getIbmSpeech(apiUrl, apiKey, audioContent, model) {
  const rsp = await fetch(
    `${apiUrl}/v1/recognize?model=${encodeURIComponent(model)}&profanity_filter=false`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa(`apikey:${apiKey}`),
        'X-Watson-Learning-Opt-Out': 'true',
        Priority: '1'
      },
      body: new Blob([audioContent], {type: 'audio/wav'}),
      credentials: 'omit'
    }
  );

  if (!rsp.ok) {
    const msg = await rsp.text();
    throw new Error(`IBM Speech error: ${rsp.status} ${msg}`);
  }

  const data = await rsp.json();
  return data.results?.[0]?.alternatives?.[0]?.transcript?.trim() ?? '';
}

async function getMicrosoftSpeech(region, apiKey, audioContent, language) {
  const rsp = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${encodeURIComponent(
      language
    )}&format=detailed&profanity=raw`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'audio/wav; codec=audio/pcm; samplerate=16000'
      },
      body: new Blob([audioContent], {type: 'audio/wav'}),
      credentials: 'omit'
    }
  );

  if (!rsp.ok) {
    const msg = await rsp.text();
    throw new Error(`Azure Speech error: ${rsp.status} ${msg}`);
  }

  const data = await rsp.json();
  return data.NBest?.[0]?.Lexical?.trim() ?? '';
}

async function transcribe(service, audioContent, {language, fallback}) {
  const serviceLanguage = languageMaps[service][language];
  if (!serviceLanguage) {
    throw new Error(`The selected language (${language}) is not supported by the chosen speech service.`);
  }

  if (service === 'wit') {
    const apiKey = speechForm.elements['witApiKey']?.value.trim();
    if (!apiKey) {
      throw new Error('Wit.ai API key is required.');
    }

    let result = await getWitSpeech(apiKey, audioContent, serviceLanguage);

    if (!result && fallback && serviceLanguage !== 'english') {
      result = await getWitSpeech(apiKey, audioContent, 'english');
    }

    return result;
  }

  if (service === 'google') {
    const apiKey = speechForm.elements['googleApiKey']?.value.trim();
    if (!apiKey) {
      throw new Error('Google Cloud API key is required.');
    }

    let result = await getGoogleSpeech(apiKey, audioContent, serviceLanguage, fallback);
    if (!result && fallback && !['en-US', 'en-GB'].includes(serviceLanguage)) {
      result = await getGoogleSpeech(apiKey, audioContent, 'en-US', false);
    }
    return result;
  }

  if (service === 'ibm') {
    const apiUrl = ensureUrl(speechForm.elements['ibmApiUrl']?.value.trim());
    const apiKey = speechForm.elements['ibmApiKey']?.value.trim();
    if (!apiUrl || !apiKey) {
      throw new Error('IBM API URL and API key are required.');
    }

    let result = await getIbmSpeech(apiUrl, apiKey, audioContent, serviceLanguage);
    if (
      !result &&
      fallback &&
      !['en-US_Multimedia', 'en-GB_Multimedia'].includes(serviceLanguage)
    ) {
      result = await getIbmSpeech(apiUrl, apiKey, audioContent, 'en-US_Multimedia');
    }
    return result;
  }

  if (service === 'microsoft') {
    const region = speechForm.elements['azureRegion']?.value;
    const apiKey = speechForm.elements['azureApiKey']?.value.trim();
    if (!region || !apiKey) {
      throw new Error('Azure region and API key are required.');
    }

    let result = await getMicrosoftSpeech(region, apiKey, audioContent, serviceLanguage);
    if (!result && fallback && !['en-US', 'en-GB'].includes(serviceLanguage)) {
      result = await getMicrosoftSpeech(region, apiKey, audioContent, 'en-US');
    }
    return result;
  }

  throw new Error('Unsupported speech service.');
}

speechForm.addEventListener('submit', async event => {
  event.preventDefault();

  const service = serviceSelect.value;
  const audioFile = audioInput.files?.[0];

  if (!audioFile) {
    setOutput('Select an audio file before transcribing.', 'error');
    return;
  }

  try {
    toggleLoading(true);

    const rawAudio = await audioFile.arrayBuffer();
    const preparedAudio = await prepareAudio(rawAudio, trimOptions);

    const transcript = await transcribe(service, preparedAudio, {
      language: languageSelect.value,
      fallback: fallbackCheckbox.checked
    });

    if (!transcript) {
      setOutput(
        'No text was returned by the speech service. Try enabling the English fallback, double-checking the API quota, or uploading a clearer audio sample.',
        'error'
      );
    } else {
      setOutput(`Transcription result:\n\n${transcript}`, 'success');
    }
  } catch (err) {
    console.error(err);
    setOutput(err.message || 'Transcription failed due to an unexpected error.', 'error');
  } finally {
    toggleLoading(false);
  }
});

// Initial render
renderServiceConfig(serviceSelect.value);
populateLanguages(serviceSelect.value);
setOutput('Load an audio CAPTCHA file and click ?Transcribe Audio? to get started.', 'status');
