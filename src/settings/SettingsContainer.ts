import { connect } from "react-redux";
import { IState } from "../store";
import Settings, { ISettingsProps } from "./settings";

const mapStateToProps = (state: IState): ISettingsProps => ({
    deviceReady: state.settings.deviceReady
});

export default connect(mapStateToProps)(Settings);
