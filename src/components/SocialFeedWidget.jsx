import React from 'react';
import SocialFeedSettings from "./SocialFeedSettings.jsx";
import SocialFeedContent from "./SocialFeedContent.jsx";

export default class SocialFeedWidget extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            settings: false
        };
    }

    componentDidMount() {
    }

    handleSettingsIconClicked() {
        this.setState((state) => {
            state.settings = !state.settings;
            return state;
        });
    }

    render() {
        var styles = {
            widget: {
                marginBottom: 24,
            },
            settingsIcon: {
                width: 20,
                position: 'absolute',
                top: 0,
                right: 10,
                marginTop: 18,
                cursor: 'pointer'
            }
        };

        if (this.state.settings)
            var childComponent = <SocialFeedSettings />;
        else
            var childComponent = <SocialFeedContent />;

        return (
            <div className="widget kerve" style={styles.widget}>
                <img src="https://cdn.jsdelivr.net/open-iconic/1.1.0/svg/cog.svg" style={styles.settingsIcon} onClick={this.handleSettingsIconClicked.bind(this)} />
                {childComponent}
            </div>
        );
    }
}
