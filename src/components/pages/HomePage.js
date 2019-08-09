import React from 'react';
import '../../App.scss';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import TextBlock from '../TextBlock';

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// tools
import { getArticles, parseSearchToTitlesArray } from '../../tools/apiFunctions.js';

// vars etc
const aboutIntro = {
  title: 'Welcome!',
  paragraph: [
    `PubMed Central (PMC) is a free digital repository that archives 
  publicly accessible full-text scholarly articles that have been published within the 
  biomedical and life sciences journal literature. This website is a portal to the resources
  provided to the public by PMC. Hopefully, this site will enable researchers to more efficiently
  organize, share and discuss scientific and medical literature. `,
  ],
  button: 'read more'
}

const resourcesIntro = {
  title: 'Resources',
  paragraph: [
    'abstracts > 35 million',
    'full text articles > 5 million',
    'patents > 4 million',
    'preprints > 80,000',
    'NIH clinical guidelines > 800'
  ],
  button: 'find resources!'
}

const journalsIntro = {
  title: 'Journals',
  paragraph: [
    'Nature',
    'Science',
    'Anatomy and Cell Biology',
    'PLoS Genetics',
    'Frontiers in Chemistry',
    'PNAS'
  ],
  button: 'search the literature!'
}

const toolsIntro = {
  title: 'Research',
  paragraph: [
    `Use this site to mine literature, organize resources, and connect with other reseachers! Using the tools
    found here, you can:`, 
    `   - Quickly compile lists of important publications and research.`,
    `   - Connect with other researchers in a public forum to share thoughts and dscuss the latest scientific findings.`,
    `   - Hopefully enjoy the process of literature mining a little more than you used to!`
  ],
  button: 'start mining!'
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    // this.fetchArticles = this.fetchArticles.bind(this);

    this.state = {
      newPublicationsInfo: {
        title: 'New Publications',
        paragraph: [],
        button: 'more articles'
      }
    };
  }

  // fetchArticles() {
  //   return getArticles('medicine', 'date')
  //     .then((results) => {
  //       // console.log(results)
  //       let articleTitles = parseSearchToTitlesArray(results).slice(0, 4);
  //       this.setState({
  //         newPublicationsInfo: {
  //           title: 'New Publications',
  //           paragraph: articleTitles,
  //           button: 'more articles'
  //         }
  //       })
  //     }).catch((e) => {
  //       console.log(e)
  //     })
  // }

  componentDidMount() {
    // return this.fetchArticles();
  }

  render() {
    return (
      <div className="page">

        <Header
          title={"PubMed Central"}
          subtitle={"making research accessible"}
        />

        <div className="row no-gutters row-eq-height">

          <div className="col col-12 col-sm-8">
            <TextBlock
              linkTo={'/about/'}
              text={aboutIntro}
            />
          </div>

          <div className="col col-12 col-sm-4">
            <TextBlock
              linkTo={'/search/'}
              text={resourcesIntro}
            />
          </div>
        </div>

        <div className="row no-gutters row-eq-height">

          <div className="col-12 col-md-4">
            <TextBlock
              linkTo={'/search/'}
              text={journalsIntro}
            />
          </div>

          <div className="col-12 col-md-8">
            {this.state.newPublicationsInfo &&
              <TextBlock
                linkTo={'/search/'}
                text={toolsIntro}
              />}
          </div>
        </div>




      </div>
    );
  }
}

const styles = {
  main: {
    width: '100%'
  }
}

export default HomePage;
