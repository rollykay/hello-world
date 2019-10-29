import React, { Component } from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import * as Google from 'expo-google-app-auth';
import firebase from 'firebase';

const googleIcon = {
  uri:
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/200px-Google_%22G%22_Logo.svg.png',
};

class LoginScreen extends Component { 

  isUserEqual = (googleUser, firebaseUser) => {
    if (firebaseUser) {
      var providerData = firebaseUser.providerData;
      for (var i = 0; i < providerData.length; i++) {
        if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
            providerData[i].uid === googleUser.getBasicProfile().getId()) {
          // We don't need to reauth the Firebase connection.
          return true;
        }
      }
    }
    return false;
  }

  onSignIn = (googleUser) => {
    console.log('Google Auth Response', googleUser);
    // We need to register an Observer on Firebase Auth to make sure auth is initialized.
    var unsubscribe = firebase.auth().onAuthStateChanged(function(firebaseUser) {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
      if (!this.isUserEqual(googleUser, firebaseUser)) {
        // Build Firebase credential with the Google ID token.
        var credential = firebase.auth.GoogleAuthProvider.credential(
          // googleUser.getAuthResponse().id_token
          googleUser.idToken,
          googleUser.accessToken
        );
        // Sign in with credential from the Google user.
        firebase
        .auth()
        .signInWithCredential(credential)
        .then(function(result){
          console.log('User signed in')
          if(result.additionalUserInfo.isNewUser){
            firebase
            .database()
            .ref('/users/' + result.user.uid)
            .set({
              gmail: result.user.email,
              profile_picture: result.additionalUserInfo.profile.picture,
              first_name: result.additionalUserInfo.profile.given_name,
              last_name: result.additionalUserInfo.profile.family_name,
              created_at: Date.now()
            })
            .then(function(snapshot) {
              // console.log('Snapshot', snapshot);
            });
          }
          else{
            firebase
            .database()
            .ref('/users/' + result.user.uid)
            .update({
              last_logged_in: Date.now()
            })
          }
        })
      
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        console.log('User already signed-in Firebase.');
      }
    }.bind(this));
  }

  LoginWithGoogleAsync = async() => {
      try {
        const result = await Google.logInAsync({
          androidClientId: '116072533469-sbda58cr9o29l9q0kjlblsv40j4lupaf.apps.googleusercontent.com',
          // behavior: 'web',
          // iosClientId: '',
          scopes: ['profile', 'email'],
        });
    
        if (result.type === 'success') {
          this.onSignIn(result);
          return result.accessToken;
        } else {
          return { cancelled: true };
        }
      } catch (e) {
        alert(e)
        return { error: true };
      }
    }

  render(){
      return (
          <View style = {styles.container}>
              <Button 
                  title = "Sign In With Google"
                  onPress = {() => this.LoginWithGoogleAsync()}
              />
          </View>
      );
  }
}

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})



// import React, { Component } from "react";
// import { StyleSheet, Text, View, Button } from "react-native";
// import * as Google from "expo-google-app-auth";
// import * as firebase from "firebase";
// //import {createSwitchNavigator} from 'react-navigation';

// export default class LoginScreen extends Component {
//   isUserEqual = (googleUser, firebaseUser) => {
//     if (firebaseUser) {
//       var providerData = firebaseUser.providerData;
//       for (var i = 0; i < providerData.length; i++) {
//         if (
//           providerData[i].providerId ===
//             firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
//           providerData[i].uid === googleUser.getBasicProfile().getId()
//         ) {
//           // We don't need to reauth the Firebase connection.
//           return true;
//         }
//       }
//     }
//     return false;
//   };

//   onSignIn = googleUser => {
//     console.log("Google Auth Response", googleUser);
//     // We need to register an Observer on Firebase Auth to make sure auth is initialized.
//     var unsubscribe = firebase.auth().onAuthStateChanged(
//       function(firebaseUser) {
//         unsubscribe();
//         // Check if we are already signed-in Firebase with the correct user.
//         if (!this.isUserEqual(googleUser, firebaseUser)) {
//           // Build Firebase credential with the Google ID token.
//           var credential = firebase.auth.GoogleAuthProvider.credential(
//             googleUser.idToken,
//             googleUser.accessToken
//           );
//           // Sign in with credential from the Google user.
//           firebase
//             .auth()
//             .signInWithCredential(credential)
//             .then(function(result) {
//               console.log("User signed In");
//               firebase
//                 .database()
//                 .ref("/users/" + result.user.uid)
//                 .set({
//                   gmail: result.user.email,
//                   profilePicture: result.additionalUserInfo.profile.picture,
//                   locale: result.additionalUserInfo.locale,
//                   firstName: result.additionalUserInfo.profile.givenName,
//                   lastName: result.additionalUserInfo.profile.familyName
//                 })
//                 .then(function(snapshot) {
//                   //console.log('snpashot', snapshot);
//                 });
//             })
//             .catch(function(error) {
//               // Handle Errors here.
//               var errorCode = error.code;
//               var errorMessage = error.message;
//               // The email of the user's account used.
//               var email = error.email;
//               // The firebase.auth.AuthCredential type that was used.
//               var credential = error.credential;
//               // ...
//             });
//         } else {
//           console.log("User already signed-in Firebase.");
//         }
//       }.bind(this)
//     );
//   };
//   signInWithGoogleAsync = async () => {
//     try {
//       //alert("Button Pressed Here");
//       const result = await Google.logInAsync({
//         behavior: "web",
//         androidClientId:
//           "116072533469-sbda58cr9o29l9q0kjlblsv40j4lupaf.apps.googleusercontent.com",

//         //iosClientId: YOUR_CLIENT_ID_HERE,
//         scopes: ["profile", "email"]
//       });

//       if (result.type === "success") {
//         this.onSignIn(result);
//         return result.accessToken;
//       } else {
//         return { cancelled: true };
//       }
//     } catch (e) {
//       //console.log("**Error");
//       return { error: true };
//     }
//   };
//   render() {
//     return (
//       <View style={styles.container}>
//         <Button
//           title="Sign In with Google"
//           onPress={() => this.signInWithGoogleAsync()}
//           // onPress={() => alert("Button Pressed")}
//         />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center"
//   }
// });
