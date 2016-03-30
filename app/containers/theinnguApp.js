'use strict';

import React, {
  Component,
  Navigator,
  BackAndroid
} from 'react-native';
import {bindActionCreators} from 'redux';

import { connect } from 'react-redux/native';
import {Router, Route, Schema, Animations, TabBar, Actions} from 'react-native-router-flux'
import {ExRouter} from 'react-native-router-flux/ExRouter'
import * as styles from './routerContainerStyles';
import TabBarItem from '../components/tabBarItem';


//import TabBar from '../components/tabBar';

import * as audioActions from '../actions/audioActions';
// import * as databaseActions from '../actions/databaseActions';
// import * as downloadActions from '../actions/downloadActions';
import * as routerActions from '../actions/routerActions';
import AudioList from '../components/audioList';
// import Favourites from '../components/favourites';
// import AddressDetails from '../components/addressDetails';
import Launch from '../components/launch';
// import VideoPage from '../components/videoPage';
// import DownloadList from '../components/downloadList';


const mapStateToProps = state => ({
  addresses : []

});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    ...audioActions,
    // ...databaseActions,
    // ...downloadActions
  }, dispatch),
  routerActions:  bindActionCreators({
    ...routerActions,
  }, dispatch),
  navActions: Actions
});

// const defaultSchema = {
//   statusStyle: 'light-content',
// };

// const favComp = connect(mapStateToProps,mapDispatchToProps)(Favourites);
// const addrComp = connect(mapStateToProps,mapDispatchToProps)(AddressList);
// const dlComp = connect(mapStateToProps,mapDispatchToProps)(DownloadList);
const AudioListComp = connect(mapStateToProps,mapDispatchToProps)(AudioList);



class TheinnguApp extends Component {
  constructor(props) {
    super(props);
  }

   render(){
     BackAndroid.addEventListener('hardwareBackPress', () => {
            try {
              return Actions.pop();
            }
            catch (err) {
                return false;
            }
        });

     return(
         <Router hideNavBar={true}
             navigationBarStyle={styles.navBarStyle} //Nav Bar Container
             barButtonTextStyle={{color: "#000"}} //No Effect?
             titleStyle={styles.navTextStyle} //Main Title Text
             barButtonIconStyle={styles.barButtonIconStyle} // E.g. Back button
             onPush={(route)=>{this.props.routerActions.onPush(route.name); return true}}
             onPop={()=>{this.props.routerActions.onPop(); return true}}
             onReplace={(route)=>{this.props.routerActions.onReplace(route.name); return true}}
         >
            <Schema name="modal" sceneConfig={Animations.FlatFloatFromBottom} hideNavBar={false}/>
            <Schema name="default" sceneConfig={Animations.FlatFloatFromRight} hideNavBar={false}/>
            <Schema name="tab" icon={TabBarItem} type="replace" hideNavBar={false} />
            <Schema name="withoutAnimation"/>

            <Route name="tabbar" hideNavBar={true}>
                <Router hideNavBar={true} footer={TabBar} tabBarStyle={styles.getTabBarStyle(this.props)} sceneStyle={styles.sceneStyle}
                     onPush={(route)=>{this.props.routerActions.onPush(route.name); return true}}
                     onPop={()=>{this.props.routerActions.onPop(); return true}}
                     onReplace={(route)=>{this.props.routerActions.onReplace(route.name); return true}}>

                    <Route name="new"  hideNavBar={true} schema="tab" tabBarItem={{title: 'News'}}>
                      <Router>
                          <Route name="launch"  hideNavBar={false} title="Theinngu" schema="default" component={Launch} initial={true} />
                      </Router>

                    </Route>
                    <Route name="audio" schema="tab" component={AudioListComp} title="Audio" tabBarItem={{ title: 'Audio'}}/>
                    <Route name="download" schema="tab" component={Launch} title="Download" tabBarItem={{title: 'Download'}} />

                </Router>
            </Route>

        </Router>

   );
   }

}

 export default connect(mapStateToProps, mapDispatchToProps)(TheinnguApp);
