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
      return (
        <View style={styles.article}>
          <Text style={styles.title}>{article.name}</Text>
          <Text style={styles.author}>{article.authorString}</Text>
          <Text style={styles.journal}>
            {`${article.journalTitle}  `} <strong>{`  ${article.pubYear}`}</strong>
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

            console.log(article)
            return (
              <View key={i} style={styles.article}>

                <View style={styles.titleBox}>
                  <Text style={styles.number}>{`${i + 1}.`}</Text>
                  <Text style={styles.title}>{`${article.title}`}</Text>
                </View>

                <Text style={styles.journal}>
                  {`${article.journalTitle}  ${article.pubYear}`}
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
    fontSize: 24,
    fontFamily: 'Quicksand-Medium'
  },
  titleBox: {
    width: '100%',
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  number: {
    margin: 5,
    fontSize: 16,
    fontFamily: 'Quicksand-Medium'
  },
  title: {
    margin: 5,
    color: '#1565C0',
    fontSize: 16,
    fontFamily: 'Quicksand'
  },
  author: {
    paddingLeft: 25,
    paddingTop: 5,
    fontSize: 14,
    fontFamily: 'Quicksand'
  },
  journal: {
    paddingLeft: 25,
    fontSize: 14,
    color: 'grey',
    fontFamily: 'Quicksand'
  }
});

export default GeneratedPdf;