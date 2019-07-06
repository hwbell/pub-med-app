import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font
} from "@react-pdf/renderer";

import Roboto from '../assets/fonts/Roboto/Roboto-Regular.ttf';
import Quicksand from '../assets/fonts/Quicksand/Quicksand-Regular.ttf';
import QuicksandMedium from '../assets/fonts/Quicksand/Quicksand-Medium.ttf';

class GeneratedPdf extends React.Component {
  constructor(props) {
    super(props);

    this.renderCollection = this.renderCollection.bind(this);
  }

  renderCollection() {
    this.props.collection.articles.map((article) => {

      let { name, authorString, journalInfo, pubYear } = article;

      return (
        <View style={styles.article}>
          <Text style={styles.title}>{name}</Text>
          <Text style={styles.author}>{authorString}</Text>
          <Text style={styles.journal}>
            {journalInfo && journalInfo.journal.title ?
              `${journalInfo.journal.title}  ` :
              ``}
            <strong>{`  ${pubYear}`}</strong>
          </Text>
        </View>
      )
    })
  }

  render() {

    return (
      <Document>
        <Page size="A4" style={styles.page}>

          <Text style={styles.header}>{this.props.collection.name}</Text>

          {this.props.collection.articles.map((article, i) => {

            let publicationInfo;

            if (article.journalInfo && article.journalInfo.journal) {
              publicationInfo = `${article.journalInfo.journal.title}  ${article.pubYear}`
            } else {
              publicationInfo = `${article.pubYear}`;
            }

            return (
              <View key={i} style={styles.article}>

                <View style={styles.titleBox}>
                  <Text style={styles.number}>{`${i + 1}.`}</Text>
                  <Text style={styles.title}>{`${article.title}`}</Text>
                </View>

                <Text style={styles.journal}>
                  {publicationInfo}
                </Text>

                <Text style={styles.author}>{article.authorString}</Text>
              </View>
            )
          })}
        </Page>
      </Document>
    );
  }
}


Font.register({
  family: 'Roboto',
  src: Roboto
})

Font.register({
  family: 'Quicksand',
  src: Quicksand
})
Font.register({
  family: 'Quicksand-Medium',
  src: QuicksandMedium
})

const styles = StyleSheet.create({
  page: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  header: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Quicksand-Medium'
  },
  titleBox: {
    width: '100%',
    marginTop: 18,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  number: {
    margin: 5,
    fontSize: 14,
    fontFamily: 'Quicksand-Medium'
  },
  title: {
    margin: 5,
    color: '#1565C0',
    fontSize: 14,
    fontFamily: 'Quicksand'
  },
  author: {
    paddingLeft: 25,
    paddingTop: 5,
    fontSize: 12,
    fontFamily: 'Quicksand'
  },
  journal: {
    paddingLeft: 25,
    fontSize: 12,
    color: 'grey',
    fontFamily: 'Quicksand'
  }
});

export default GeneratedPdf;