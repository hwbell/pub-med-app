import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import CollectionForm from './CollectionForm';

{/* <CollectionForm
  article={this.state.selected}
  isVisible={this.state.collectionModal}
  toggle={this.toggleCollectionForm}
  collections={this.props.collections}
  createNewCollection={this.props.createNewCollection}
  modifyCollection={this.props.modifyCollection} /> */}

// stubs for testing calls
const toggleStub = jest.fn();
const createNewStub = jest.fn();
const modifyStub = jest.fn();

// some sample props
const article = {
  "id": "30865231",
  "source": "MED",
  "pmid": "30865231",
  "doi": "10.1093/molbev/msz059",
  "title": "The Genome of Drosophila innubila Reveals Lineage-Specific Patterns of Selection in Immune Genes.",
  "authorString": "Hill T, Koseva BS, Unckless RL.",
  "journalTitle": "Mol Biol Evol",
  "issue": "7",
  "journalVolume": "36",
  "pubYear": "2019",
  "journalIssn": "0737-4038; 1537-1719; ",
  "pageInfo": "1405-1417",
  "pubType": "journal article",
  "isOpenAccess": "N",
  "inEPMC": "N",
  "inPMC": "N",
  "hasPDF": "N",
  "hasBook": "N",
  "citedByCount": 0,
  "hasReferences": "N",
  "hasTextMinedTerms": "Y",
  "hasDbCrossReferences": "Y",
  "dbCrossReferenceList": {
    "dbName": [
      "EMBL"
    ]
  },
  "hasLabsLinks": "Y",
  "hasTMAccessionNumbers": "N",
  "firstIndexDate": "2019-03-14",
  "firstPublicationDate": "2019-07-01"
}

const collections = [0,1,2,3,4,5].map((num) => {
  return {
    name: `collection ${num+1}`,
    articles: [
      article
    ]
  }
})

const user = {
  name: 'dude',
  collections: collections.slice(3)
}

describe('CollectionForm', () => {

  let wrapper, someProps;
  beforeEach(() => {
    someProps = {
      user,
      article,
      collections,
      isVisible: false,
      toggle: toggleStub,
      createNewCollection: createNewStub,
      modifyCollection: modifyStub
    }

    wrapper = shallow(<CollectionForm {...someProps} />);    
  })

  it('renders without crashing', async () => {
    wrapper.update();
  });
  
  it('renders correctly', async () => {
    const tree = await renderer
      .create(<CollectionForm {...someProps} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  
  it('contains the correct elements', () => {
    const wrapper = shallow(<CollectionForm {...someProps} />);
    expect(wrapper.find('Modal').length).toEqual(1)
  
    // title 
    expect(wrapper.find('.thread-text').length).toBe(1);
  
    // should have two .nav-link buttons with the names of the provided collections for 
    // both newly created collections and server collections
    expect(wrapper.find('.nav-link').length).toEqual(9);
    expect(wrapper.find('.nav-link').at(0).html()).toContain(collections[0].name);
    expect(wrapper.find('.nav-link').at(1).html()).toContain(collections[1].name);
  
    // two size="sm" buttons - these don't have a unique class right now
    expect(wrapper.find({ size: 'sm' }).length).toEqual(2);
    expect(wrapper.find({ size: 'sm' }).at(0).html()).toContain('add article');
    expect(wrapper.find({ size: 'sm' }).at(1).html()).toContain('close');
  
    // a preview of the article, really its just the title
    expect(wrapper.find('#article-preview').length).toEqual(1);
    expect(wrapper.find('#article-preview').text()).toEqual(article.title+"will be added to the collection.");
  
  })
  
  it('should register localStorage collections if there are none in props', async () => {
    // set the localStorage collections and toss the props collections
    localStorage.setItem('collections', JSON.stringify(collections))
    someProps.collections = [];

    const deepWrapper = mount(<CollectionForm {...someProps} />);
    // this.props.createNewCollection should be called for each of the local collections
    expect(createNewStub.mock.calls.length).toEqual(6);
    
  })
  
  it('should change the title based on whether there are collections or not', async () => {
  
    // with collections
    expect(wrapper.find('.thread-text').at(0).text()).toEqual(
      "Select a collection to add the article to, or make a new collection."
    );
    // without collections
    wrapper.setProps({ collections: [] });
    wrapper.update();
    expect(wrapper.find('.thread-text').at(0).text()).toEqual(
      `You don't currently have any new collections ... would you like to make one? You can enter a name below.`
    );
  })
  
  it('should open and close depending on isVisble prop', async () => {
    const deepWrapper = mount(<CollectionForm {...someProps} />);
  
    // starts out closed
    expect(deepWrapper.find('Modal').props().isOpen).toEqual(false);
  
    // the Modal's isOpen prop changes when different isVisible booleans are provided
    // to the parent
    [true, false, true].forEach((bool) => {
      deepWrapper.setProps({ isVisible: bool })
      deepWrapper.update();
  
      // now should match provided boolean
      expect(deepWrapper.find('Modal').props().isOpen).toEqual(bool);
    })
  
    deepWrapper.setProps({ isVisible: true })
    deepWrapper.update();
  
    // now should be open
    expect(deepWrapper.find('Modal').props().isOpen).toEqual(true);
  
    deepWrapper.setProps({ isVisible: false })
    deepWrapper.update();
  
    // and now closed again
    expect(deepWrapper.find('Modal').props().isOpen).toEqual(false);
  
  })
  
  it('should set the highlightInd for selector buttons', () => {
    const wrapper = shallow(<CollectionForm {...someProps} />);
  
    // the highlightInd should initially be null
    expect(wrapper.state().highlightInd).toEqual(null);
    expect(wrapper.find('.nav-link').length).toEqual(9);
  
    // click the collections and check the highlightInd matches
    wrapper.find('.nav-link').forEach((link, i) => {
      link.simulate('click');
      wrapper.update();
      expect(wrapper.state().highlightInd).toEqual(i);
    })
  
  })
  
  it('should close when "close" button is clicked', () => {
    const deepWrapper = shallow(<CollectionForm {...someProps} />);
  
    // set the highlightInd to a non-null number
    deepWrapper.setState({highlightInd: 1});
    expect(deepWrapper.state().highlightInd).toEqual(1);
  
    // simulate the click
    deepWrapper.find({size: 'sm'}).at(1).simulate('click');
    deepWrapper.update();
  
    // after the call the highlightInd should be set to null, and the toggleStub should
    // have been called. there's a setTimeout on the highlighInd reset, so account for that.
    expect(toggleStub.mock.calls.length).toEqual(1);
  
    setTimeout(() => {
      expect(deepWrapper.state().highlightInd).toEqual(null);
    }, 1100) // the timer in the component is 1000
  })
  
  it('should fire the submit function when "add to collection" button is clicked', () => {
    const deepWrapper = shallow(<CollectionForm {...someProps} />);
  
    // set the highlightInd to a non-empty string
    deepWrapper.setState({name: 'Cancer Biology'});
    expect(deepWrapper.state().name).toEqual("Cancer Biology");
  
    // simulate the click
    deepWrapper.find({size: 'sm'}).at(0).simulate('click', {
      preventDefault: () => {}
    });
    deepWrapper.update();
  
    // after the call the name should be set to an empty string, and the createNewStub should
    // have been called
    expect(deepWrapper.state().highlightInd).toEqual(null);
  
  })

})
