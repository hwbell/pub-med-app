import React from 'react';
import '../../App.css';
import 'bootstrap/dist/css/bootstrap.css';

// components
import Header from '../Header';
import TextBlock from '../TextBlock';

// elements

// styling
// import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// tools
import { getArticles, parseSearchToTitlesArray } from '../../tools/apiFunctions';

// vars etc
const aboutIntro = {
  title: 'About PMC',
  paragraph: [
    `PubMed Central (PMC) is a free digital repository that archives 
  publicly accessible full-text scholarly articles that have been published within the 
  biomedical and life sciences journal literature. As one of the major research 
  databases within the suite of resources that have been developed by the National 
  Center for Biotechnology Information (NCBI), PubMed Central is much more than just 
  a document repository. Launched in February 2000, the repository has grown rapidly 
  as the NIH Public Access Policy is designed to make all research funded by the 
  National Institutes of Health (NIH) freely accessible to anyone, and, in addition, 
  many publishers are working cooperatively with the NIH to provide free access to 
  their works.`,
  ],
  button: 'read more'
}

const resourcesIntro = {
  title: 'Resources',
  paragraph: [
    'abstracts > 34 million',
    'full text articles > 5 million',
    'patents > 4 million',
    'preprints > 74,000',
    'agricola records > 700,000',
    'NIH clinical guidelines > 800'
  ],
  button: 'find a resource'
}

const journalsIntro = {
  title: 'Journals',
  paragraph: [
    'Nature',
    'Science',
    'Cardiology and Therapy',
    'Anatomy and Cell Biology',
    'Journal of Applied Physics',
    'PLoS Genetics',
    'Frontiers in Chemistry'
  ],
  button: 'search literature'
}

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newPublicationsInfo: null

    };
  }

  componentDidMount() {
    getArticles('medicine', 'date')
      .then((results) => {
        // console.log(results)
        let articleTitles = parseSearchToTitlesArray(results).slice(0,4);
        this.setState({
          newPublicationsInfo: {
            title: 'New Publications',
            paragraph: articleTitles,
            button: 'more articles'
          }
        })
      }).catch((e) => {
        console.log(e)
      })
  }

  render() {
    return (
      <div className="page">

        <Header
          title={"PubMed Central"}
          subtitle={"making research accessible"}
        />

        <div className="row no-gutters row-eq-height">

          <div className="col col-12 col-md-8">
            <TextBlock
              text={aboutIntro}
            />
          </div>

          <div className="col col-12 col-md-4">
            <TextBlock
              text={resourcesIntro}
            />
          </div>
        </div>

        <div className="row no-gutters row-eq-height">

          <div className="col-12 col-md-4">
            <TextBlock
              text={journalsIntro}
            />
          </div>

          <div className="col-12 col-md-8">
            {this.state.newPublicationsInfo &&
              <TextBlock
                text={this.state.newPublicationsInfo}
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
