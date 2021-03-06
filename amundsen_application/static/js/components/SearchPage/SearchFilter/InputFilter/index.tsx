import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { clearFilterByCategory, updateFilterByCategory, ClearFilterRequest, UpdateFilterRequest } from 'ducks/search/filters/reducer';

import { APPLY_BTN_TEXT } from '../constants';

import { GlobalState } from 'ducks/rootReducer';

interface OwnProps {
  categoryId: string;
}

interface StateFromProps {
  value: string;
}

interface DispatchFromProps {
  clearFilterByCategory: (categoryId: string) => ClearFilterRequest;
  updateFilterByCategory: (categoryId: string, value: string) => UpdateFilterRequest;
}

export type InputFilterProps = StateFromProps & DispatchFromProps & OwnProps;

export interface InputFilterState {
  value: string;
}

export class InputFilter extends React.Component<InputFilterProps, InputFilterState> {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentDidUpdate = (prevProps: StateFromProps) => {
    const newValue = this.props.value;
    if (prevProps.value !== newValue) {
      this.setState({ value: newValue || '' });
    }
  };

  onApplyChanges = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if(!!this.state.value) {
      this.props.updateFilterByCategory(this.props.categoryId, this.state.value);
    }
    else {
      this.props.clearFilterByCategory(this.props.categoryId);
    }
  };

  onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value.toLowerCase() })
  };

  render = () => {
    const { categoryId } = this.props;
    return (
      <form className="input-section-content form-group" onSubmit={ this.onApplyChanges }>
        <input
          type="text"
          className="form-control"
          name={ categoryId }
          onChange={ this.onInputChange }
          value={ this.state.value }
        />
        <button
          name={ categoryId }
          className="btn btn-default"
          type="submit"
        >
          { APPLY_BTN_TEXT }
        </button>
      </form>
    );
  }
};

export const mapStateToProps = (state: GlobalState, ownProps: OwnProps) => {
  const filterState = state.search.filters;
  const value = filterState[state.search.selectedTab] ? filterState[state.search.selectedTab][ownProps.categoryId] : '';
  return {
    value: value || '',
  }
};

export const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators({
    clearFilterByCategory,
    updateFilterByCategory,
  }, dispatch);
};

export default connect<StateFromProps, DispatchFromProps, OwnProps>(mapStateToProps, mapDispatchToProps)(InputFilter);
