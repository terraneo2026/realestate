"use client";

/**
 * Design System Showcase Component
 * Demonstrates all design system elements
 */

export default function DesignSystemShowcase() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <h1>Design System Showcase</h1>
      
      {/* Typography */}
      <section className="m-2xl">
        <h2>Typography</h2>
        <h1>Heading 1 (34px, Weight 600)</h1>
        <h2>Heading 2 (26px, Weight 600)</h2>
        <h3>Heading 3 (18px, Weight 500)</h3>
        <p>Body text (14px, Weight 400) - This is regular paragraph text with proper line height for readability.</p>
        <small>Small text (12px) - For secondary information</small>
      </section>

      {/* Colors */}
      <section className="m-2xl">
        <h2>Color Palette</h2>
        <div className="grid grid-cols-4 gap-lg">
          <div className="card">
            <div className="primaryBg" style={{ height: '100px' }}></div>
            <div className="card-body">
              <p className="text-small font-semibold">Primary</p>
              <p className="text-muted text-small">#087c7c</p>
            </div>
          </div>
          
          <div className="card">
            <div style={{ height: '100px', backgroundColor: 'var(--secondary-sell)' }}></div>
            <div className="card-body">
              <p className="text-small font-semibold">Sell</p>
              <p className="text-muted text-small">#0186d8</p>
            </div>
          </div>

          <div className="card">
            <div style={{ height: '100px', backgroundColor: 'var(--secondary-rent)' }}></div>
            <div className="card-body">
              <p className="text-small font-semibold">Rent</p>
              <p className="text-muted text-small">#db9305</p>
            </div>
          </div>

          <div className="card">
            <div style={{ height: '100px', backgroundColor: 'var(--error-color)' }}></div>
            <div className="card-body">
              <p className="text-small font-semibold">Error</p>
              <p className="text-muted text-small">#DB3D26</p>
            </div>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="m-2xl">
        <h2>Buttons</h2>
        <div className="grid grid-cols-3 gap-lg">
          <button className="btn btn-primary">Primary Button</button>
          <button className="btn btn-secondary">Secondary Button</button>
          <button className="btn btn-outline">Outline Button</button>
          
          <button className="btn btn-ghost">Ghost Button</button>
          <button className="btn btn-danger">Delete Button</button>
          <button className="btn btn-primary" disabled>Disabled Button</button>

          <button className="btn btn-primary btn-small">Small Button</button>
          <button className="btn btn-primary btn-large">Large Button</button>
          <button className="btn btn-primary btn-small" disabled>Disabled Small</button>
        </div>
      </section>

      {/* Cards */}
      <section className="m-2xl">
        <h2>Cards</h2>
        <div className="grid grid-cols-2 gap-lg">
          <div className="card">
            <div className="card-image" style={{ backgroundColor: 'var(--background-light)' }}>
              <div className="flex-center" style={{ height: '200px' }}>
                <span style={{ fontSize: '48px' }}>🏠</span>
              </div>
            </div>
            <div className="card-body">
              <h3>Card Title</h3>
              <p className="text-muted text-small m-lg">This is a basic card with image, title, and content.</p>
            </div>
            <div className="card-footer">
              <button className="btn btn-primary w-full">Action</button>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h4>Card with Header</h4>
            </div>
            <div className="card-body">
              <p>Content goes here. Cards can have header, body, and footer sections.</p>
            </div>
            <div className="card-footer flex-between">
              <button className="btn btn-ghost btn-small">Cancel</button>
              <button className="btn btn-primary btn-small">Confirm</button>
            </div>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="m-2xl">
        <h2>Forms</h2>
        <div className="grid grid-cols-2 gap-lg">
          <div className="form-group">
            <label className="label">Email Address</label>
            <input type="email" className="input" placeholder="you@example.com" />
            <div className="form-hint">We'll never share your email</div>
          </div>

          <div className="form-group">
            <label className="label">Property Type</label>
            <select className="select">
              <option>Select an option</option>
              <option>For Rent</option>
              <option>For Lease</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Message</label>
            <textarea className="textarea" placeholder="Enter your message"></textarea>
            <div className="form-error">This field is required</div>
          </div>

          <div className="form-group">
            <label className="label">Budget Range</label>
            <input type="range" className="input" min="0" max="1000000" />
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="m-2xl">
        <h2>Badges</h2>
        <div className="gap-md" style={{ display: 'flex', flexWrap: 'wrap' }}>
          <span className="badge badge-primary">Primary</span>
          <span className="badge badge-secondary">Secondary</span>
          <span className="badge badge-success">Success</span>
          <span className="badge badge-warning">Warning</span>
          <span className="badge badge-error">Error</span>
          <span className="badge badge-outline">Outline</span>
        </div>
      </section>

      {/* Spacing */}
      <section className="m-2xl">
        <h2>Spacing Scale</h2>
        <div className="grid grid-cols-4 gap-lg">
          {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((space) => (
            <div key={space} className="card">
              <div 
                style={{ 
                  backgroundColor: 'var(--primary-color)',
                  height: `var(--spacing-${space})`,
                }}
                className="m-lg"
              ></div>
              <div className="card-body">
                <p className="text-small">{space.toUpperCase()}</p>
                <p className="text-muted text-xs">var(--spacing-{space})</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section className="m-2xl">
        <h2>Shadow System</h2>
        <div className="grid grid-cols-5 gap-lg">
          {['xs', 'sm', 'md', 'lg', 'xl'].map((shadow) => (
            <div key={shadow} className={`shadow-${shadow} p-lg`}>
              <p className="text-center text-small">{shadow.toUpperCase()}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Grid System */}
      <section className="m-2xl">
        <h2>Responsive Grid</h2>
        <p className="text-muted m-lg">Resize the window to see responsive behavior</p>
        <div className="grid grid-cols-4 gap-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card flex-center p-2xl">
              <span>{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Utilities */}
      <section className="m-2xl">
        <h2>Text Utilities</h2>
        <div className="grid grid-cols-2 gap-lg">
          <div className="card">
            <div className="card-body">
              <p className="text-center">Centered Text</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-muted">Muted/Secondary Text</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="text-"> Text</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="truncate">This is a very long text that will be truncated with ellipsis...</p>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <p className="line-clamp-2">This is a very long text that will be clamped to two lines. It will show only two lines and then get cut off with ellipsis depending on the content length.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
