import React from 'react'
import { i18n, withTranslation } from '../i18n'
import Head from 'next/head'
import axios from 'axios'
import Karadetail from '../components/Karadetail';
import FilterTools from '../utils/filterTools';
import RuntimeConfig from '../utils/RuntimeConfig';
const API_URL = RuntimeConfig.API_URL;
const filterTools = new FilterTools();

class Karapage extends React.Component {
  static async getInitialProps({ req, query, res }) {

    const filterParams = filterTools.init(query);

    const kid = query.kid;
    var kara = null;
    if(kid)
    {
      var response = await axios.get(API_URL+'/api/karas/'+kid)
      kara = response.data
    }
    let namespacesRequired = ['common', 'tag'];
    // on renvoi ici les props qui seront disponible dans le composant monté
    return { namespacesRequired, kid, kara, filterParams}
  }

  constructor (props) {
    // on met à jour le "State" du composant qui sert pour les comportement interne en dehors du cadre du routage url
    super(props)
    this.state = {}

    filterTools.setParams(props.filterParams);
  }

  render() {
    return (
      <div>
        <Head>
          <title key="title">{i18n.t('sitename')} - {this.props.kara ? this.props.kara.title : i18n.t('kara.unknown')}</title>
        </Head>
        {this.props.kara ? <Karadetail key='kara' data={this.props.kara} tags={this.props.tags} filterTools={filterTools}/> : null }
      </div>
    )
  }
}

export default withTranslation(['common','tag'])(Karapage)