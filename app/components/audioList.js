import React, {
  StyleSheet,
  Component,
  Text,
  TextInput,
  TouchableHighlight,
  ListView,
  PropTypes,
  Image,
  ScrollView,
  AsyncStorage,
  TouchableOpacity,
  ToastAndroid,
  Platform
} from 'react-native';
var _ = require('underscore');
var RefreshableListView = require('react-native-refreshable-listview');
var { createAnimatableComponent, View } = require('react-native-animatable');
var Spinner = require('react-native-spinkit');
var Overlay = require('react-native-overlay');
var IonIcon = require('react-native-vector-icons/Ionicons');
import Toast from './toast.ios';
const STORAGE_KEY = '@GeoEncoding:address'

import Database from '../database/database';

// import globals from '../store/globals';
import * as assets from '../../assets';
// var request = require('request');
// var cheerio = require('cheerio');


class AudioList extends Component {

  constructor(props) {
    super(props);
    Database.loadDB();

    // Local state to show/hide Toast box
    this.state = {toastText: '',isVisible: false, temp:''};

    // Early binding
    this.hideToast = this.hideToast.bind(this)
    // this.onRowPressed = this.onRowPressed.bind(this)
    // this.onFavPressed = this.onFavPressed.bind(this)
    this.renderRow = this.renderRow.bind(this)
    // this.updateList = this.updateList.bind(this)
    this.getAudioFileList = this.getAudioFileList.bind(this)
  }

  componentDidMount() {
      // this.loadAddress().done();
      console.log(this.props);
      this.props.actions.fetchAudioFiles("",Database)
      // this.debouncedFetch = _.debounce(this.props.actions.fetchAudioFiles, 100);
  }

  // async loadAddress() {
  //     try {
  //         let value = await AsyncStorage.getItem(STORAGE_KEY);
  //         this.props.actions.changeSearchText(value);
  //
  //         let rowCount = this.props.addresses.getRowCount()
  //         if(!this.props.isEmpty && this.props.searchString !== null && rowCount === 0){
  //           this.debouncedFetch(this.props.searchString, Database);
  //         }
  //     } catch(error) {
  //         // // console.log(error);
  //     }
  // }

  hideToast() {
      if(this.props.routerState[0] == 'launch'){
          this.setState({isVisible: false});
      }
  }


  updateList(){
    // var address = this.props.searchString;
    // this.debouncedFetch(address, Database);
  }

  // onReplayPressed(){
  //   this.props.actions.resetState();
  //
  //   var timeoutIndex = 0
  //   globals.replayCache.map(function(action){
  //     if( action.action.type !== 'RESET_STATE'){
  //       timeoutIndex++;
  //       var dispatch = action.next;
  //
  //        setTimeout(() => {
  //          dispatch(action.action);
  //        }, 500 * timeoutIndex);
  //     }
  //   })
  // }

  // onRowPressed(rowData){
  //     // console.log(this.props);
  //     this.props.navActions.details({data:rowData});
  // }

  // onFavPressed(rowData, i, isFav) {
  //     var message = 'placeholder';
  //     if(isFav) {
  //         message = "Removed";
  //     } else {
  //         message = "Added";
  //     }
  //
  //     if(Platform.OS ==='ios') {
  //         this.setState({toastText: message});
  //         this.setState({isVisible: true});
  //         setTimeout(this.hideToast, 800);
  //     }
  //     else {
  //         ToastAndroid.show(message, ToastAndroid.SHORT);
  //     }
  //
  //     if(isFav) {
  //         this.props.actions.unFavourite(Database, rowData.formatted_address, i);
  //     } else {
  //         this.props.actions.insertFavourites(Database, rowData.formatted_address, i);
  //     }
  //
  // }


  renderRow(rowData, i, j){
    var address = "HELLO" ; //rowData.formatted_address;
    // var imageURI = 'https://maps.googleapis.com/maps/api/streetview?size=800x800&location=' + rowData.geometry.location.lat + ',' + rowData.geometry.location.lng;
    var favIcon = rowData.isFav ?
    (<IonIcon name = "ios-star" size = {28} color = "ffde00" style = {styles.fav} allowFontScaling={false}/>):
    (<IonIcon name = "ios-star-outline" size = {28} color = "ff9900" style = {styles.fav} allowFontScaling={false}/>);
    return(
      <TouchableHighlight onPress={this.onRowPressed.bind(this, rowData)}
          underlayColor='#dddddd'>
          <View animation="fadeIn" duration={800} delay={200}>
                <View style={styles.row}>
                    <View style={styles.rowAddress}>
                        <Text style={styles.address}>{address}</Text>
                        <TouchableHighlight style = {styles.favTouchable}  onPress={(rowData.isFav) ?  this.onFavPressed.bind(this, rowData, j, true) : this.onFavPressed.bind(this, rowData, j, false)} underlayColor='#fff'>
                            {favIcon}
                        </TouchableHighlight>
                    </View>
                    <Image style = {styles.thumb}
                           source = {{uri: imageURI}}
                           defaultSource = {require('../../assets/loading_streetview.png')}
                           loadingIndicatorSource = {require('../../assets/loading_streetview.png')} />
                </View>
                <View style={styles.separator}/>
          </View>
      </TouchableHighlight>
    )
  }

  renderFav(rowData) {
    return(
        <View>
            <Text style={styles.address}>{rowData.address}</Text>
        </View>
    );
  }

 async getAudioFileList(){
    var url = 'http://dhammadownload.com/AshinSandimar(AungLan)-mp3InMyanmar.htm';
    console.log("URL : " + url);
    var jsonList = [];

    try{
        let response = await fetch(url);
        let responseText = await response.text();

        var patt = /http:\/\/dhammadownload.com\/MP3Library\/AshinSandimar.*\<\/a\>/g
        var linkPatt = /http:\/\/dhammadownload.com\/MP3Library\/AshinSandimar.*.mp3/g
        var titlePatt = /\>.*\</g
        var list = responseText.match(patt)

        for(var i=0; i < list.length; i++){
            var item = list[i];
            var json = new Object();
            json.title = item.match(titlePatt)[0].replace(/\>|\</g,'')
            json.link = item.match(linkPatt)[0]
            jsonList.push(json);
        }
        console.log(list[0]);
        console.log(jsonList[0]);
        this.setState({temp:jsonList[0].link})
        // return jsonList[0];
    }catch(error){
        console.error(error);
    }


    // fetch(url)
    // .then((response) => response.text())
    // .then((responseText) => {
    //   var patt = /http:\/\/dhammadownload.com\/MP3Library\/AshinSandimar.*\<\/a\>/g
    //   var linkPatt = /http:\/\/dhammadownload.com\/MP3Library\/AshinSandimar.*.mp3">/g
    //   var titlePatt = /\>.*\</g
    //   var list = responseText.match(patt)
    //
    //
    //   for(var i=0; i < list.length; i++){
    //       var item = list[i];
    //       var json = new Object();
    //       json.title = item.match(titlePatt)[0].replace(/\>|\</g,'')
    //       json.link = item.match(linkPatt)[0]
    //       jsonList.push(json);
    //   }
    //   console.log(list[0]);
    //   console.log(jsonList[0]);
    // })
    // return jsonList;
  }

  render() {
    const { files } = this.props;
    // var files = [1,2,3]
    // var scroll = !this.props.isLoading && !this.props.isEmpty ?
    // (<ScrollView style={styles.listContainer}>
    //             <RefreshableListView
    //                 dataSource={files}
    //                 renderRow={this.renderRow}
    //                 loadData={this.updateList}
    //                 refreshDescription="Refreshing articles"
    //                 automaticallyAdjustContentInsets = {false}
    //             />
    //     </ScrollView>):
    // ( <View/> );
    var title = this.getAudioFileList();
    console.log("title")
    console.log(title);
    var empty = !this.props.isLoading && this.props.isEmpty ?
    (<View style = {styles.emptyContainer}>
        <Text style = {styles.noResultText}>Search result not found!</Text>
    </View>):
    ( <View/> );

    if(Platform.OS ==='ios') {
        var spinner = this.props.isLoading ?
        ( <View style = {styles.spinner}>
            <Spinner
            isVisible = {true}
            size = {50}
            type = 'Pulse'
            color = '#ffbb99' />
          </View>):
        ( <View/> );
    } else {
        var spinner = this.props.isLoading ?
        ( <View style = {styles.spinner}>
            <Spinner
            style = {styles.spinner}
            isVisible = {true}
            size = {50}
            type = 'ThreeBounce'
            color = '#ffbb99' />
          </View>):
        ( <View/> );
    }
    console.log("Get Audio File List");
    return (
        <View style={styles.pageContainer}>
            <Toast isVisible = {this.state.isVisible} onDismiss = {this.hideToast} position = 'top'>
                <View>
                    <Text style = {styles.toastText} allowFontScaling={false}>{this.state.toastText}</Text>
                </View>
            </Toast>
            {spinner}
            <View style={styles.container}>
                <Text>{this.state.temp}</Text>
            </View>

            {empty}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
  },
    pageContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    inputContainer: {
      // marginTop:80,
      marginTop: (Platform.OS ==='ios') ? 80 : 120,
      flexDirection:'row',
      alignItems: 'center',
      alignSelf:'stretch'
    },
    toastText: {
        color: '#777777',
        padding: 15,
        backgroundColor: 'transparent',
        fontSize: 14
    },
    spinner: {
        marginTop: 40,
        alignSelf: 'center'
    },
    listContainer: {
      flex:1,
      marginTop:20,
      flexDirection:'column',
      marginBottom: (Platform.OS ==='ios') ? 55 : 0,
    },
    emptyContainer: {
      flex: 1,
      marginTop: 50,
      marginBottom: 50,
      alignSelf: 'center'
    },
    searchInput: {
      flex: 1,
      height: 36,
      padding: 4,
      marginLeft : 10,
      marginRight: 10,
      fontSize: 18,
      color: 'gray',
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 8,
      backgroundColor: '#f00'
    },
    button:{
      padding :5,
      height: 26,
      color: 'white',
      backgroundColor:'#48BBEC',
      alignSelf:'stretch',
      justifyContent:'center'
    },
    buttonText:{
      fontSize:18,
      color:'white'
    },
    row:{
      padding :10,
      flexDirection: 'column'

    },separator:{
      height:1,
      backgroundColor:'gray'
    },
    thumb: {
        height: 100,
        marginTop: 10
    },
    rowAddress:{
      flexDirection: 'row',
      alignItems: 'stretch',
      justifyContent: 'space-between'

    },
    address: {
        fontSize: 14,
        flex: 9
    },
    favTouchable: {
        flex: 1
    },
    fav: {
      alignSelf: 'center',
      width: 25,
      height: 25
    },
    noResultText: {
      fontSize: 24,
      color: 'gray'
  }
});
module.exports = AudioList
