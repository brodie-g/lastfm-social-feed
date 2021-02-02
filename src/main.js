import React from 'react';
import ReactDOM from 'react-dom';
import Widget from './components/Widget.jsx';
import observeDomChanges from './observeDomChanges';
import * as language from './language';
import SocialFeedWidget from "./components/SocialFeedWidget.jsx";

function renderWidget() {

    if (language.getPathWithoutLanguage() === '/home') {
        return renderSocialFeed();
    }

    if (!language.getPathWithoutLanguage().startsWith('/music')) {
        return;
    }

    var sidebarEl = document.querySelector('.col-sidebar');
    if (sidebarEl) {
        var widgetRootEl = document.createElement('div');
        sidebarEl.insertBefore(widgetRootEl, sidebarEl.firstChild);

        ReactDOM.render(<Widget />, widgetRootEl);
        var videoOrArtEl = sidebarEl.querySelector('.video-preview')
            || sidebarEl.querySelector('.album-overview-cover-art');
        if (videoOrArtEl) {
            videoOrArtEl.style.marginTop = 0;
        }
    }
}

function renderSocialFeed() {
    var containerEl = document.querySelector('.container');
    if (containerEl) {
        var widgetRootEl = document.createElement('div');
        containerEl.insertBefore(widgetRootEl, containerEl.firstChild);

        ReactDOM.render(<SocialFeedWidget />, widgetRootEl);
    }
}

renderWidget();

observeDomChanges(renderWidget);
